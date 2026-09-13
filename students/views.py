from django.contrib import messages
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect, render

from .forms import StudentForm
from .models import Student


def student_list(request):
    query = request.GET.get('q', '').strip()
    students = Student.objects.all()
    if query:
        students = students.filter(
            Q(student_id__icontains=query)
            | Q(name__icontains=query)
            | Q(email__icontains=query)
            | Q(department__icontains=query)
        )

    context = {
        'students': students,
        'query': query,
        'total_students': Student.objects.count(),
        'department_count': Student.objects.values('department').distinct().count(),
        'recent_students': Student.objects.order_by('-id')[:5],
    }
    return render(request, 'students/student_list.html', context)


def student_create(request):
    form = StudentForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, 'Student added successfully.')
        return redirect('student_list')
    return render(request, 'students/student_form.html', {'form': form, 'form_title': 'Add Student'})


def student_edit(request, pk):
    student = get_object_or_404(Student, pk=pk)
    form = StudentForm(request.POST or None, instance=student)
    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, 'Student updated successfully.')
        return redirect('student_list')
    return render(
        request,
        'students/student_form.html',
        {'form': form, 'form_title': 'Edit Student', 'student': student},
    )


def student_delete(request, pk):
    student = get_object_or_404(Student, pk=pk)
    if request.method == 'POST':
        student.delete()
        messages.success(request, 'Student deleted successfully.')
    return redirect('student_list')