from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import FileUploadParser
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
from rest_framework.parsers import MultiPartParser
from server.serializers import ReportFileSerialzier
from server.serializers import LectureListSerializer
from server.serializers import LectureSerializer
from server.models import UserLectures
from server.models import Lecture
from server.models import Task
from server.models import Report
from server.models import ReportFile
from server.models import Comment
from server.serializers import LectureDetailsSerializer
from server.serializers import TaskSerializer
from server.serializers import LectureSummaryListSerializer
from server.serializers import ReportDetailsSerializer
from server.serializers import UsersDataSerializer
from django.core.files.storage import FileSystemStorage
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.conf import settings

import uuid
import os;
import json;

def handle_uploaded_file(file):
    try:
        file_extension = os.path.splitext(file.name)[-1]
        random_filename = str(uuid.uuid4().hex[:8]) + file_extension
        file_path = random_filename
        saved_path = default_storage.save(file_path, ContentFile(file.read()))
        return {'status': 'ok', 'path': saved_path}
    except:
        return {'status': 'error'}

class HelloView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)
    
class UserDetails(APIView):
   def post(self,request):
        JWT_authenticator = JWTAuthentication()

        response = JWT_authenticator.authenticate(request)
        if response is not None:
            user , token = response
            return Response(token.payload)
        else:
            return JsonResponse({'error':'Invalid Token'})
        
class ReportFileUpload(APIView):
    parser_class = (MultiPartParser,)

    def post(self, request):
        file_serializer = ReportFileSerialzier(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=201)
        else:
            return Response(file_serializer.errors, status=400)
        

#Lectures
##############################################################################################################

class LectureAdd(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = LectureSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

class LectureList(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        lectures = Lecture.objects.all()
        serializer = LectureListSerializer(lectures, many=True, context={'request': request})
        return Response(serializer.data)
    

class LectureDelete(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        lecture = Lecture.objects.get(id=request.data['id'])
        user = request.user
        if lecture.owner_id != user.id:
            return JsonResponse({'status': 'error'}, status=403)
        lecture.delete()
        return JsonResponse({'status': 'ok'}, status=200)


class LectureJoin(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        id = request.data['id']
        lecture = Lecture.objects.get(id=id)

        userJoined = UserLectures.objects.filter(user_id=request.user.id, lecture_id=id).exists()

        if(userJoined):
            return JsonResponse({'status': 'error'}, status=403)

        if(lecture):
            UserLectures.objects.create(user_id=request.user.id, lecture_id=id)
            return JsonResponse({'status': 'ok'}, status=200)
        else:
            return JsonResponse({'status': 'error'}, status=403)
        

class LectureDetails(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        id = request.data['id']
        lecture = Lecture.objects.get(id=id)
  
        if(not lecture):
            return JsonResponse({'status': 'error'}, status=403)
        serializer = LectureDetailsSerializer(lecture)
        return Response(serializer.data)


class LectureTasksList(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user_id = request.data['user_id']

        lectures = UserLectures.objects.filter(user=user_id);

        if(not lectures):
            return JsonResponse({}, status=200)
        
        serializer = LectureSummaryListSerializer(lectures, many=True, context={'request': request})
        return Response(serializer.data)
    




#Tasks
##############################################################################################################

class TaskAdd(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    


class TaskDelete(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        task = Task.objects.get(id=request.data['id'])

        lecture = None

        if(task):
            lecture = Lecture.objects.get(id=task.lecture_id)

        user = request.user
        if lecture and lecture.owner_id != user.id:
            return JsonResponse({'status': 'error'}, status=403)
        task.delete()
        return JsonResponse({'status': 'ok'}, status=200)
    



#Specific task info


class ReportDetails(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        userID = request.data['user_id']
        lectureID = request.data['lecture_id']
        taskID = request.data['task_id']

        task = Task.objects.get(id=taskID)

        if(userID == None or lectureID == None or task == None):
            return JsonResponse({'status': 'error'}, status=403)

        if(not task):
            return JsonResponse({'status': 'error'}, status=403)
        
        serializer = ReportDetailsSerializer(task, context={'request': request});
        return Response(serializer.data, status=200)


class UsersListWithReports(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        lectureID = request.data['lecture_id']

        if(lectureID == None):
            return JsonResponse({'status': 'error'}, status=403)

        usersLectures = UserLectures.objects.filter(lecture_id=lectureID)

        users = User.objects.filter(id__in=usersLectures.values('user_id'))

        lectureUsersData  = UsersDataSerializer(users, many=True, context={'request': request}).data
        
        return JsonResponse(lectureUsersData, status=200, safe=False)

class SetGrade(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        lectureID = request.data['lecture_id']
        taskID = request.data['task_id']
        studentID = request.data['user_id']
        grade = request.data['grade']
        description = request.data['description']

        grades = ('2.0', '3.0', '3.5', '4.0', '4.5', '5.0')

        if(grade not in grades):
            return JsonResponse({'status': 'error', 'message': 'Incorrect grade'}, status=400)
        
        if(lectureID == None or taskID == None or studentID == None or grade == None):
            return JsonResponse({'status': 'error', 'message': 'Incorrect params'}, status=400)

        userReport = Report.objects.filter(lecture_id=request.data['lecture_id'], taskID=request.data['task_id'], student=request.data['user_id'])

        if(not userReport):
            userReport = [None];
            userReport[0] = Report.objects.create(
                lecture = Lecture.objects.get(id=request.data['lecture_id']),
                taskID = Task.objects.get(id=request.data['task_id']),
                student = User.objects.get(id=request.data['user_id']),
                files = '{"files": []}',
                grade = 0,
                lecturerComment = '{"comments": []}')
            
        userReport[0].grade = float(grade)

        if(description != None and len(description) > 0):
            comment = Comment.objects.create(
                lecture = Lecture.objects.get(id=request.data['lecture_id']),
                task = Task.objects.get(id=request.data['task_id']),
                student = User.objects.get(id=request.data['user_id']),
                text = request.data['description'],
                author = request.user,
            )

            commentString = userReport[0].lecturerComment or '{"comments": []}'
            objectDtring = json.loads(commentString)
            objectDtring['comments'].append(comment.id)
            userReport[0].lecturerComment = json.dumps(objectDtring)


        userReport[0].save()

        return Response({'status': 'ok'}, status=200)
    
class UploadNewReport(APIView): 
    permission_classes = (IsAuthenticated,)
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        file_obj = request.FILES['file']

        available_extensions = ('pdf', 'PDF', 'doc', 'DOC', 'docx', 'DOCX')

        if not file_obj.name.endswith(available_extensions):
            return JsonResponse({'status': 'error', 'message': 'Wymagany format pliku to PDF.'})
        
        max_size = 15 * 1024 * 1024
        if file_obj.size > max_size:
            return JsonResponse({'status': 'error', 'message': 'Maksymalny rozmiar pliku to 15 MB.'})

        result = handle_uploaded_file(file_obj);

        if(result['status'] == 'error'):
            return Response({'status': 'error', 'message': 'Wystąpił błąd podczas przesyłania pliku!'}, status=400)
        
        reportFile = ReportFile.objects.create(
            path = result['path'],
            name = file_obj.name,
            extension = file_obj.name.split('.')[-1],
            user = request.user,
            lecture = Lecture.objects.get(id=request.data['lecture_id']),
            task = Task.objects.get(id=request.data['task_id']),
            description = request.data['description'],
        )


        userReport = Report.objects.filter(lecture_id=request.data['lecture_id'], taskID=request.data['task_id'], student=request.user)

        if(not userReport):
            userReport = [None];
            userReport[0] = Report.objects.create(
                lecture = Lecture.objects.get(id=request.data['lecture_id']),
                taskID = Task.objects.get(id=request.data['task_id']),
                student = request.user,
                files = '{"files": []}',
                grade = 0,
                lecturerComment = '',
            )


        reportString = userReport[0].files or '{"files": []}'
        objectDtring = json.loads(reportString)
        objectDtring['files'].append(reportFile.id)
        userReport[0].files = json.dumps(objectDtring)
        userReport[0].save()

        return Response({'status': 'ok'}, status=200)
    

class AddNewComment(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        comment = Comment.objects.create(
            lecture = Lecture.objects.get(id=request.data['lecture_id']),
            task = Task.objects.get(id=request.data['task_id']),
            student = User.objects.get(id=request.data['user_id']),
            text = request.data['description'],
            author = request.user,
        )

        userReport = Report.objects.filter(lecture_id=request.data['lecture_id'], taskID=request.data['task_id'], student=request.data['user_id'])

        if(not userReport):
            userReport = [None];
            userReport[0] = Report.objects.create(
                lecture = Lecture.objects.get(id=request.data['lecture_id']),
                taskID = Task.objects.get(id=request.data['task_id']),
                student = User.objects.get(id=request.data['user_id']),
                files = '{"files": []}',
                grade = 0,
                lecturerComment = '{"comments": []}')
            
        reportString = userReport[0].lecturerComment or '{"comments": []}'
        objectDtring = json.loads(reportString)
        objectDtring['comments'].append(comment.id)
        userReport[0].lecturerComment = json.dumps(objectDtring)
        userReport[0].save()

        return Response({'status': 'ok'}, status=200)
    


def downloadReportFile(request, id, file_path):
    url_path = os.path.join(settings.MEDIA_ROOT, file_path)

    reportFile = None

    try:
        reportFile = ReportFile.objects.get(id=id)
        if(reportFile.path != file_path):
            return JsonResponse({'status': 'error'}, status=404);
    except:
        return JsonResponse({'status': 'error'}, status=404)


    if os.path.exists(url_path):
        with open(url_path, 'rb') as fh:
            response = HttpResponse(fh.read(), content_type="application/octet-stream")
            file_name = reportFile.name;
            response['Content-Disposition'] = 'inline; filename=' + file_name;
            return response
    else:
        return JsonResponse({'status': 'error'}, status=404)
    