# Generated by Django 4.2.3 on 2023-08-08 21:14

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_alter_pointupdate_unique_together'),
    ]

    operations = [
        migrations.AddField(
            model_name='problem',
            name='createdAt',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2023, 8, 8, 21, 14, 38, 976596, tzinfo=datetime.timezone.utc)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='problem',
            name='updatedAt',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
