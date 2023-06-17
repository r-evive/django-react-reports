from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from server.models import ReportFile
from server.models import Lecture
from django.contrib.auth.models import User
from server.models import UserLectures
from server.models import Task
from server.models import Report
from server.models import Comment
import json


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['full_name'] = user.get_full_name()
        token['admin'] = user.is_superuser
        token['groups'] = ', '.join(map(str, user.groups.all()))
        token['email'] = user.email
        return token
    
class ReportFileSerialzier(serializers.ModelSerializer):
    class Meta:
        model = ReportFile
        fields = '__all__'

    def validate_report(self, report):
        if report.size > 1000000:
            raise serializers.ValidationError("File is too large!")
        
        extension = report.name.split('.')[-1]

        if(extension not in ['pdf', 'doc', 'docx']):
            raise serializers.ValidationError("Wrong extension!");
    
        return report

#Lectures
##############################################################################################################

class LectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = '__all__'

class LectureListSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    joined = serializers.SerializerMethodField()

    class Meta:
        model = Lecture
        fields = ['id', 'name', 'description', 'owner_id', 'created', 'owner_name', 'joined']

    def get_owner_name(self, obj):
        user = User.objects.get(id=obj.owner_id)
        return f"{user.first_name} {user.last_name}"
    
    def get_joined(self, obj):
        request = self.context.get('request')
        return UserLectures.objects.filter(user_id=request.user.id, lecture_id=obj.id).exists()
    

class LectureDetailsSerializer(serializers.ModelSerializer):
    tasks = serializers.SerializerMethodField()
    owner_name = serializers.SerializerMethodField()

    class Meta:
        model = Lecture
        fields = ['id', 'name', 'description', 'owner_id', 'created', 'tasks', 'owner_name']

    def get_tasks(self, obj): 
        return [TaskSerializer(task).data for task in Task.objects.filter(lecture_id=obj.id)]
    
    def get_owner_name(self, obj):
        user = User.objects.get(id=obj.owner_id)
        return f"{user.first_name} {user.last_name}"
    


#Tasks
##############################################################################################################

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


class LectureSummaryListSerializer(serializers.ModelSerializer):
    lecture_name = serializers.SerializerMethodField()
    lecture_owner = serializers.SerializerMethodField()
    reports = serializers.SerializerMethodField()

    class Meta:
        model = UserLectures
        fields = ['lecture_id', 'lecture_name', 'lecture_owner', 'reports']

    def get_lecture_name(self, obj):
        return Lecture.objects.get(id=obj.lecture_id).name
    
    def get_lecture_owner(self, obj):
        lecture = Lecture.objects.get(id=obj.lecture_id)
        return f"{lecture.owner.first_name} {lecture.owner.last_name}"

    def get_reports(self, obj):
        tasks = Task.objects.filter(lecture_id=obj.lecture_id)

        # for task in tasks:
        #     report = Report.objects.filter(taskID=task.id, lecture_id=obj.lecture_id, student_id=obj.user_id)
        #     if(report):
        #         task.grade = report[0].grade;

        return TaskSerializer(tasks, many=True).data


#Specific report details

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'



class ReportDetailsSerializer(serializers.ModelSerializer):
    lecture_name = serializers.SerializerMethodField()
    lecture_owner = serializers.SerializerMethodField()
    files = serializers.SerializerMethodField()
    report = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = ['id', 'name', 'description', 'deadline', 'lecture_id', 'lecture_name', 'lecture_owner', 'report', 'files', 'comments', 'student_name']

    def get_lecture_name(self, obj):
        return Lecture.objects.get(id=obj.lecture_id).name
    
    def get_lecture_owner(self, obj):
        lecture = Lecture.objects.get(id=obj.lecture_id)
        return f"{lecture.owner.first_name} {lecture.owner.last_name}"

    def get_files(self, obj):
        return []
    
    def get_report(self, obj):
        report = None
        try: 
            report = Report.objects.get(taskID=obj.id, lecture_id=obj.lecture_id, student_id=self.context.get('request').data['user_id'])
        except: 
            report = None

        if(not report):
            return {}
        return ReportSerializer(report).data
    
    def get_files(self, obj):
        report = None

        try:
            report = Report.objects.get(taskID=obj.id, lecture_id=obj.lecture_id, student_id=self.context.get('request').data['user_id'])
        except:
            report = None

        if(not report):
            return []
        
        #Array of IDs
        reportFiles = json.loads(report.files or '{"files":[]}')['files']

        files = ReportFile.objects.filter(id__in=reportFiles)

        return ReportFileSerialzier(files, many=True).data
    
    def get_comments(self, obj):
        report = None

        try:
            report = Report.objects.get(taskID=obj.id, lecture_id=obj.lecture_id, student_id=self.context.get('request').data['user_id'])
        except:
            report = None

        print(report)

        if(not report):
            return []
        
        #Array of IDs

        commentsArray = json.loads(report.lecturerComment or '{"comments":[]}')['comments'];
        print(commentsArray)
        comments = Comment.objects.filter(id__in=commentsArray)

        return CommentSerializer(comments, many=True).data
    
    def get_student_name(self, obj):
        user = User.objects.get(id=self.context.get('request').data['user_id'])
        return f"{user.first_name} {user.last_name}"


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'



class UsersDataSerializer(serializers.ModelSerializer):
    tasks = serializers.SerializerMethodField()
    reports = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name','email', 'tasks', 'reports']

    def get_tasks(self, obj):
        tasks = Task.objects.filter(lecture_id = self.context.get('request').data['lecture_id'])
        return TaskSerializer(tasks, many=True).data
    
    def get_reports(self, obj):
        reports = Report.objects.filter(lecture_id = self.context.get('request').data['lecture_id'], student_id=obj.id)
        return ReportSerializer(reports, many=True).data
        

