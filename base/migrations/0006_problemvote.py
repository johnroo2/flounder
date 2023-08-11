# Generated by Django 4.2.3 on 2023-08-11 21:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_alter_user_points'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProblemVote',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.IntegerField()),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('updatedAt', models.DateTimeField(auto_now=True)),
                ('problem', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.problem')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.user')),
            ],
            options={
                'unique_together': {('problem', 'user')},
            },
        ),
    ]
