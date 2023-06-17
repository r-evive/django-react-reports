from django.contrib import admin
from django.urls import path
from server.views import views
from rest_framework_simplejwt import views as jwt_views


urlpatterns = [
    path('admin/', admin.site.urls),

    #Users
    path('login', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/get_user_details', views.UserDetails.as_view(), name='get_user_details'),

    #Lectures
    path('lectures/add', views.LectureAdd.as_view(), name='add_lecture'),
    path('lectures/get', views.LectureList.as_view(), name='get_lectures'),
    path('lectures/delete', views.LectureDelete.as_view(), name='delete_lecture'),
    path('lectures/join', views.LectureJoin.as_view(), name='join_lecture'),
    path('lectures/get_single', views.LectureDetails.as_view(), name='get_single_lecture'),
    path('lectures/get_summary', views.LectureTasksList.as_view(), name='get_lecture_summary'),
    path('report/details', views.ReportDetails.as_view(), name='report_details'),
    path('lectures/members', views.UsersListWithReports.as_view(), name='lecture_members'),

    #Tasks
    path('tasks/add', views.TaskAdd.as_view(), name='add_task'),
    path('tasks/delete', views.TaskDelete.as_view(), name='delete_task'),

    #Submit reports

    path('report/upload', views.UploadNewReport.as_view(), name='upload_report'),
    path('report/download/<str:id>/<str:file_path>', views.downloadReportFile, name='download_report'),
    path('report/setgrade', views.SetGrade.as_view(), name='set_grade'),

    #Comments
    path('comments/add', views.AddNewComment.as_view(), name='add_comment'),
]
