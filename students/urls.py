from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views
from .api import StudentViewSet

router = DefaultRouter()
router.register('', StudentViewSet, basename='api-student')

urlpatterns = [
    path('', views.student_list, name='student_list'),
    path('students/add/', views.student_create, name='student_create'),
    path('students/<int:pk>/edit/', views.student_edit, name='student_edit'),
    path('students/<int:pk>/delete/', views.student_delete, name='student_delete'),
    path('api/students/', include(router.urls)),
]