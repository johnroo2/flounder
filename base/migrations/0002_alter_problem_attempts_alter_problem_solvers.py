# Generated by Django 4.2.3 on 2023-08-10 17:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='problem',
            name='attempts',
            field=models.ManyToManyField(blank=True, related_name='attempteds', to='base.user'),
        ),
        migrations.AlterField(
            model_name='problem',
            name='solvers',
            field=models.ManyToManyField(blank=True, related_name='solveds', to='base.user'),
        ),
    ]