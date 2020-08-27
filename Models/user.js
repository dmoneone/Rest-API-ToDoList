const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    resetToken: String,
    resetTokenExp: Date,
    avatarUrl: String,
    name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    subscriptions: {
        users: [
            {
                userId: {
                    type: Schema.Types.ObjectId
                }
            }
        ]
    },
    subscribers: {
        users: [
            {
                userId: {
                    type: Schema.Types.ObjectId
                }
            }
        ]
    },
    toDoList: {
        items: [
            {
                title: {
                    type: String
                },
                date: {
                    type: Date,
                    default: Date.now
                },
            }
        ]
    }
})
//todo
userSchema.methods.addNewPost = function(title) {
    const clonedItems = [...this.toDoList.items]
    
    clonedItems.push({
        title,
    })

    this.toDoList = {items: clonedItems}
    return this.save()
}

userSchema.methods.removePost = function(postId) {
    let clonedItems = [...this.toDoList.items]

    clonedItems = clonedItems.filter(post => post._id.toString() !== postId.toString())

    this.toDoList = {items: clonedItems}
    return this.save()
}

userSchema.methods.updatePost = function(postId, title) {
    let clonedItems = [...this.toDoList.items]

    let ind = clonedItems.findIndex(post => post._id.toString() === postId.toString())

    if(ind >= 0) {
        clonedItems[ind].title = title
    }
    
    this.toDoList = {items: clonedItems}
    return this.save()
}

userSchema.methods.clearList = function() {
    this.toDoList = {items: []}
    return this.save()
}
//users

userSchema.methods.follow = function(userId) {
    const clonedUsers = [...this.subscriptions.users]
    
    const ind = clonedUsers.findIndex(item => item.userId.toString() === userId)
    if(ind > -1 ) return

    clonedUsers.push({ userId })
    this.subscriptions = { users: clonedUsers }

    return this.save()
}

userSchema.methods.unfollow = function(userId) {
    const clonedUsers = [...this.subscriptions.users]

    const ind = clonedUsers.findIndex(item => item.userId.toString() === userId)
    if(ind === -1 ) return

    this.subscriptions = { users: clonedUsers.filter(item => item.userId.toString() !== userId) }

    return this.save()
}

module.exports = model('User', userSchema)
