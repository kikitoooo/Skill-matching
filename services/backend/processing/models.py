from django.db import models
from users.models import CustomUser

class Resume(models.Model):
    first_name = models.CharField('first_name', max_length=150)
    patronymic_name = models.CharField('patronymic_name', max_length=150, blank=True, null=True)
    surname = models.CharField(max_length=150)
    job = models.CharField(max_length=156, blank=True, null=True)
    skills = models.JSONField(verbose_name='Перечень навыков', blank=True, null=True)
    resume_file = models.FileField(upload_to='resumes/')
    parsed_resume = models.TextField(verbose_name='Распаршенный файл')
    created_at = models.DateTimeField(auto_now_add=True)


class Vacancy(models.Model):
    name = models.CharField(verbose_name='Название вакансии', max_length=256)
    description = models.TextField(verbose_name='Описание вакансии')
    required_skills = models.JSONField(verbose_name='Требуемые навыки')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)


class JobMatching(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE) #HR, который провёл проверку на совпадение
    vacancy = models.ForeignKey(Vacancy, on_delete=models.CASCADE)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    match = models.FloatField(verbose_name='Коэффициент совпадения резюме с вакансией')
    shortage = models.JSONField(verbose_name='Нехватка навыков')
    created_at = models.DateTimeField(auto_now_add=True)
