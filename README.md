# Дипломный проект movies-explorer (backend)
---

_Дипломный проект выполнен в рамках курса [Яндекс.Практикум "Веб-разработка"](https://praktikum.yandex.ru/web)_

[![](https://telegram.fra1.digitaloceanspaces.com/channels/cppdevjob/68_2020_05_26_1.jpg)](https://praktikum.yandex.ru/web/)

Данный репозиторий содержит [backend часть](https://movies.maratb.nomoredomains.monster/) Дипломного проекта movies-explorer со следующими возможностями: авторизации и регистрации пользователей, добавления фильма в избранное пользователем и его удаления, а так же возможность изменения данных профиля пользователя.

- Серверная часть реализована с помощью библиотеки Express
- Http сервер - ✨Nginx✨

Для реализации проекта был выбран облачный сервис - [Yandex.Cloud](https://cloud.yandex.ru/), т.к. среди прочего
он предоставляет [грант на бесплатное использование сервиса.](https://cloud.yandex.ru/docs/billing/concepts/bonus-account) 

Проект имеет SSL-сертификат и поддерживает протокол HTTPS,
frontend часть расположена в репозитории https://github.com/mbagaut/movies-explorer-frontend

Протестировать api сервиса можно по адресу https://movies.maratb.nomoredomains.monster/
Работу сервиса в целом https://movies-explorer.maratb.nomoredomains.monster/

## Используемые технологии

- **Git**
- **Express**
- **Nginx**
- **MongoDB**

## Как запустить

Для запуска сервера, в зависимости от задачи, используйте команды

```sh
npm run start
```
или

```sh
npm run dev
```

чтобы запустить ESlint

```sh
npm run lint
```
## Автор

_Багаутдинов Марат_
