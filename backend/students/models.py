from django.db import models

# Create your models here.
class Student(models.Model):
    student_id = models.CharField(max_length=20)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    department = models.CharField(max_length=100)
    year = models.IntegerField()
    phone = models.CharField(max_length=15)

    def __str__(self):
        return self.name