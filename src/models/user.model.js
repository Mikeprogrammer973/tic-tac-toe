import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
        email: {
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        fullName: {
            type: String
        },
        password: {
            type: String,
            required: true,
            minLength: 10
        },
        profilePic: {
            type: {
              name: {
                type: String
              },
              uri: {
                type: String
              }
            },
            default: {
              name: "",
              uri: ""
            }
        },
        games: {
          type: [
            {
              mode: {
                type: String,
                required: true
              },
              vs: {
                type: String,
                required: true
              },
              date: {
                init: {
                  type: String,
                  required: true
                },
                end: {
                  type: String,
                  required: true
                }
              },
              result: {
                type: Number,
                required: true
              }
            }
          ]
        },
        stats: {
          type: {
            xp: {
              type: Number,
              required: true
            },
            level: {
              type: Number,
              required: true
            }
          },
          default: {
            xp: 0,
            level: 1
          }
        },
        prefs: {
          type: {
            _2fa: {
              type: Boolean,
              required: true
            },
            _public: {
              type: Boolean,
              required: true
            }
          },
          default: {
            _2fa: false,
            _public: true
          }
        }
    },
    { timestamps: true }
)

const User = mongoose.model("User", userSchema)

export default User
