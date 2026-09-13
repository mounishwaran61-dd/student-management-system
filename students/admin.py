from django.contrib import admin

# Register your models here.
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
	list_display = ('id', 'student_id', 'name', 'email', 'department', 'year', 'phone')
	search_fields = ('student_id', 'name', 'email', 'department')
	list_filter = ('department', 'year')