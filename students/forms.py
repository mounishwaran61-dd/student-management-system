from django import forms

from .models import Student


class StudentForm(forms.ModelForm):
    class Meta:
        model = Student
        fields = ['student_id', 'name', 'email', 'department', 'year', 'phone']
        widgets = {
            'student_id': forms.TextInput(attrs={'placeholder': 'e.g. STU-2026-001'}),
            'name': forms.TextInput(attrs={'placeholder': 'Full name'}),
            'email': forms.EmailInput(attrs={'placeholder': 'student@example.com'}),
            'department': forms.TextInput(attrs={'placeholder': 'e.g. Computer Science'}),
            'year': forms.NumberInput(attrs={'min': 1, 'max': 10, 'placeholder': 'e.g. 2'}),
            'phone': forms.TextInput(attrs={'placeholder': 'Phone number'}),
        }