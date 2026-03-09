import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: ''
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
    } else {
      const parsed = JSON.parse(userData)
      setUser(parsed)
      setFormData(parsed)
    }
  }, [navigate])

  const handleSave = () => {
    localStorage.setItem('user', JSON.stringify(formData))
    setUser(formData)
    setIsEditing(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-gray-900 rounded-lg p-8">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center text-5xl mb-4">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                '👤'
              )}
            </div>
            {isEditing && (
              <input
                type="url"
                placeholder="Avatar URL"
                value={formData.avatar}
                onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                className="w-full p-2 rounded bg-gray-800 text-white text-sm"
              />
            )}
          </div>

          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 h-32"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="bg-yellow-500 text-black px-6 py-2 rounded font-bold hover:bg-yellow-400"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setFormData(user)
                      setIsEditing(false)
                    }}
                    className="bg-gray-700 px-6 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                <p className="text-gray-400 mb-4">{user.email}</p>
                <p className="text-sm text-gray-500 mb-4">Member since {user.joinDate}</p>
                {user.bio && (
                  <div className="mb-6">
                    <h3 className="font-bold mb-2">Bio</h3>
                    <p className="text-gray-300">{user.bio}</p>
                  </div>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 text-black px-6 py-2 rounded font-bold hover:bg-yellow-400"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
