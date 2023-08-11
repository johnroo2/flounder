# Generated by Django 4.2.3 on 2023-08-11 13:09

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_user_points'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='history',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=300), default=list, size=None),
        ),
    ]
