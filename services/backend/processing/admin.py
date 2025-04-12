from django.contrib import admin
from processing.models import Resume, Vacancy, JobMatching


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'surname', 'job', 'skills', 'resume_file', 'created_at']
    search_fields = ['first_name', 'surname', 'job']
    list_filter = ['patronymic_name']
    ordering = ['patronymic_name']


@admin.register(Vacancy)
class VacancyAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'required_skills', 'created_at', 'updated_at']
    search_fields = ['name']
    list_filter = ['name']
    ordering = ['name']


@admin.register(JobMatching)
class JobMatchingAdmin(admin.ModelAdmin):
    list_display = ['user', 'vacancy', 'resume', 'match', 'shortage', 'created_at']
    search_fields = ['id']
    list_filter = ['id']
    ordering = ['id']
# Register your models here.
