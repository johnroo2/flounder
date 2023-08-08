from django.urls import re_path
from . import view_user, view_problem, view_login, view_pointupdate

urlpatterns = [
    re_path(r'^api/user/$', view_user.data_list),
    re_path(r'^api/user/(?P<pk>[0-9]+)/$', view_user.data_detail),
    re_path(r'^api/user/points/(?P<username>[^/]+)/$', view_user.data_detail_points),
    re_path(r'^api/problem/$', view_problem.data_list),
    re_path(r'^api/problem/(?P<pk>[0-9]+)/$', view_problem.data_detail),
    re_path(r'^api/login/$', view_login.auth),
    re_path(r'^api/profile/(?P<username>[^/]+)/$', view_user.data_detail_profile),
    re_path(r'^api/pointupdate/$', view_pointupdate.data_list),
    re_path(r'^api/pointupdate/(?P<pk>[0-9]+)/$', view_pointupdate.data_detail),
]

