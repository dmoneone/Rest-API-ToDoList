# Restful_CRUD_API_toDoList
Restful CRUD API with Node.js, Express and MongoDB

# DOCS 

## Auth
### Login
POST: /api/auth/login <br />
Headers: { 'Content-Type': 'application/json' } <br />
Body: { email: string, password: string } <br />
Response: { token: 'Bearer ...' } <br />
### Register
POST: /api/auth/register <br />
Headers: { 'Content-Type': 'application/json' } <br />
Body: { email: string, password: string, extraPassword: string, name: string } <br />
Response: { "message": "new user has been added" } <br />
### Reset Password
POST: /api/auth/reset <br />
Headers: { 'Content-Type': 'application/json' } <br />
Body: { email: string } <br />
Response: { message: string } <br />
Message with link will come to your email. <br />
### Get token and userId for password saveing
GET: /api/auth/password/:token <br />
Response: { userId: string, token: string } <br />
This token for saveing. Auth token is not the same. You can make this req by pressing link button in your email letter.<br />
### Save Password
POST: /api/auth/password <br />
Headers: { 'Content-Type': 'application/json' } <br />
Body: { userId: string, token: string, password: string } <br />

## ToDo List

### Get list
GET: /api/list?page={page} <br />
Headers: { Authorization: token } <br />
Response: { list: Array<object>, pageCount: number, userId: string } <br />
### Add post
POST: /api/list/addPost <br />
Headers: { 'Content-Type': 'application/json', Authorization: token } <br />
Body: { title: string  } <br />
Response: { message: string, newPostTitle: string, id: string} <br />
### Update post
PUT: /api/list/updatePost <br />
Headers: { 'Content-Type': 'application/json', Authorization: token } <br />
Body: { title: string, postId: string  } <br />
Response: { newTitle: string, message: string, postId: string} <br />
### Remove post
DELETE: /api/list/removeList/:id <br />
Headers: { Authorization: token } <br />
Body: { postId: string  } <br />
Response: { message: string, postId: string} <br />
### Clear list
DELETE: /api/list/clearList <br />
Headers: { Authorization: token } <br />
Response: { message: string } <br />
## Profile
### Get profile
GET: /api/profile <br />
Headers: { Authorization: token } <br />
Response: { message: string, user: object as typeof { email: '', userId: '', name: '', avatarUrl: ''} } <br />
### Upload Avatar
POST: /api/profile/addAvatar <br />
Headers: { 'Content-Type': 'multipart/form-data', Authorization: token } <br />
Body: { avatar: *selected file* } <br />
Response: { message: string } <br />
