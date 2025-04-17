from django.db import models
from users.models import CustomUser
import os

class Resume(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='resumes', verbose_name='HR')
    name = models.CharField(max_length=150, blank=True, null=True)
    job = models.CharField(max_length=156, blank=True, null=True)
    skills = models.JSONField(verbose_name='Перечень навыков', blank=True, null=True)
    resume_file = models.FileField(upload_to='resumes/')
    parsed_resume = models.TextField(verbose_name='Распаршенный файл')
    file_name = models.CharField(max_length=255, blank=True, verbose_name='Название файла')
    missing_skills = models.JSONField(default=list, verbose_name='Недостающие навыки')
    matchPercentage = models.FloatField(default=0, verbose_name='Процент соответствия')
    date = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.resume_file and not self.file_name:
            self.file_name = os.path.basename(self.resume_file.name)
        super().save(*args, **kwargs)

class Vacancy(models.Model):
    name = models.CharField(verbose_name='Название вакансии', max_length=256)
    description = models.TextField(verbose_name='Описание вакансии')
    required_skills = models.JSONField(verbose_name='Требуемые навыки')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)


class JobMatching(models.Model):
    HR = models.ForeignKey(CustomUser, on_delete=models.CASCADE,)
    vacancy = models.ForeignKey(Vacancy, on_delete=models.CASCADE)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    match = models.FloatField(verbose_name='Коэффициент совпадения резюме с вакансией')
    shortage = models.JSONField(verbose_name='Нехватка навыков')
    created_at = models.DateTimeField(auto_now_add=True)
