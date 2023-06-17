from django.db import models
from django.contrib.auth.models import User

class Lecture(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} {self.description} {self.owner} {self.created}"

class Task(models.Model):
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    deadline = models.DateTimeField()
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lecture} {self.name} {self.description} {self.deadline} {self.created}"

class ReportFile(models.Model):
    name = models.CharField(max_length=100)
    path = models.CharField(max_length=255)
    extension = models.CharField(max_length=10)
    creationDate = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE, default=-1)
    description = models.CharField(max_length=1024, default="")

    def __str__(self):
        return f"{self.name} {self.path}"

class Report(models.Model):
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
    taskID = models.ForeignKey(Task, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    files = models.CharField(max_length=8192, default="")
    date = models.DateTimeField(auto_now_add=True)
    grade = models.FloatField()
    lecturerComment = models.CharField(max_length=8192, default="")
    rateDate = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lecture} {self.taskID}"
    

class UserLectures(models.Model):
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    joined = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lecture} {self.user} {self.joined}"
    
class Comment(models.Model):
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='task_student')
    text = models.CharField(max_length=8192, default="")
    creationDate = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comment_author')

    def __str__(self):
        return f"{self.text}"