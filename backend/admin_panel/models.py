from sqladmin import ModelView
from db.models import (
    User,
    Client,
    Service,
    Comment,
    Record,
)


class UserAdmin(ModelView, model=User):
    column_list = [
        User.id,
        User.name,
        User.phone,
        User.position,
        User.experience,
        User.birthday,
        User.is_admin,
        User.is_staff,
    ]
    column_searchable_list = [User.name, User.phone, User.position]
    column_sortable_list = [User.name, User.experience]
    column_details_exclude_list = [
        User.hashed_password,
        User.records,
        User.image,
    ]
    form_excluded_columns = [
        User.hashed_password,
        User.records,
        User.image,
    ]
    column_labels = {
        User.name: "Имя",
        User.phone: "Телефон",
        User.position: "Должность",
        User.experience: "Опыт работы",
        User.birthday: "Дата рождения",
        User.is_admin: "Администратор",
        User.is_staff: "Сотрудник",
        User.registered_at: "Дата регистрации",
        User.services: "Услуги",
        User.clients: "Клиенты",
        User.comments: "Комментарии",
    }


class ClientAdmin(ModelView, model=Client):
    column_list = [
        Client.id,
        Client.name,
        Client.phone,
        Client.birthday,
        Client.email,
        Client.instagram,
        Client.telegram,
        Client.communication,
    ]
    column_searchable_list = [
        Client.name,
        Client.telegram,
        Client.instagram,
        Client.phone,
    ]
    column_sortable_list = [
        Client.name,
    ]
    column_details_exclude_list = [
        # Client.auth_code,
        Client.image,
        Client.user_id,
    ]
    form_excluded_columns = [
        Client.auth_code,
        Client.image,
        Client.user_id,
    ]
    column_labels = {
        Client.name: "Имя",
        Client.phone: "Телефон",
        Client.birthday: "Дата рождения",
        Client.email: "Эл. почта",
        Client.instagram: "Инстаграм",
        Client.telegram: "Телеграм",
        Client.registered_at: "Дата регистрации",
        Client.registered_by: "Кем зарегистрирован",
        Client.communication: "Коммуникация",
        Client.records: "Записи",
        Client.comments: "Комментарии",
    }


class ServiceAdmin(ModelView, model=Service):
    column_list = [
        Service.id,
        Service.name,
        Service.price,
        Service.duration,
    ]
    column_searchable_list = [
        Service.name,
    ]
    column_sortable_list = [
        Service.name,
        Service.price,
        Service.duration,
    ]
    column_details_exclude_list = [
        Service.records,
        Service.users,
    ]
    form_excluded_columns = [
        Service.records,
        Service.users,
    ]
    column_labels = {
        Service.name: "Название",
        Service.price: "Стоимость",
        Service.duration: "Продолжительность (мин)",
    }


class RecordAdmin(ModelView, model=Record):
    column_list = [
        Record.id,
        Record.name,
        Record.date,
        Record.time,
        Record.client,
        Record.author,
        Record.users,
        Record.price,
        Record.status,
        Record.created_at,
    ]
    column_searchable_list = [
        Record.name,
        Record.date,
        Record.client,
    ]
    column_sortable_list = [
        Record.name,
        Record.date,
        Record.client,
    ]
    column_details_exclude_list = [
        Record.image,
        Record.client_id,
    ]
    form_excluded_columns = [
        Record.image,
        Record.client_id,
    ]
    column_labels = {
        Record.name: "Название",
        Record.date: "Дата",
        Record.time: "Время",
        Record.status: "Статус",
        Record.price: "Итоговая стоимость",
        Record.comment: "Комментарий",
        Record.author: "Автор записи",
        Record.services: "Услуги",
        Record.users: "Мастера",
        Record.client: "Клиент",
        Record.created_at: "Дата создания",
        Record.author: "Автор",
        Record.comments: "Комментарии",
    }


class CommentAdmin(ModelView, model=Comment):
    column_list = [
        Comment.id,
        Comment.rating,
        Comment.created_at,
        Comment.client,
        Comment.user,
        Comment.record,
    ]
    column_searchable_list = [
        Comment.user,
        Comment.client,
    ]
    column_sortable_list = [
        Comment.id,
        Comment.rating,
        Comment.client,
        Comment.user,
        Comment.record,
    ]
    column_details_exclude_list = [
        Comment.image,
        Comment.client_id,
        Comment.user_id,
        Comment.record_id,
    ]
    form_excluded_columns = [
        Comment.image,
        Comment.client_id,
        Comment.user_id,
        Comment.record_id,
    ]
    column_labels = {
        Comment.content: "Содержание",
        Comment.created_at: "Дата",
        Comment.rating: "Оценка",
        Comment.client: "Клиент",
        Comment.user: "Мастер",
        Comment.record: "Запись",
    }
