# Generated by Django 4.2.3 on 2023-08-08 17:57

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=20, unique=True)),
                ('password', models.CharField(max_length=20)),
                ('firstname', models.CharField(max_length=20)),
                ('lastname', models.CharField(max_length=20)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('about', models.CharField(blank=True, max_length=1000)),
                ('isAdmin', models.BooleanField(default=False)),
                ('isMod', models.BooleanField(default=False)),
                ('image', models.ImageField(blank=True, null=True, upload_to='profile_images/')),
                ('token', models.CharField(blank=True, max_length=1000, null=True)),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('updatedAt', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Problem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=10000)),
                ('image', models.ImageField(blank=True, null=True, upload_to='problem_images/')),
                ('options', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=150), default=list, size=6)),
                ('answer', models.IntegerField()),
                ('solution', models.CharField(blank=True, max_length=10000)),
                ('value', models.IntegerField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.user')),
            ],
        ),
        migrations.CreateModel(
            name='PointUpdate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.user')),
            ],
        ),
    ]
