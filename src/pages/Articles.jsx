import { useState } from 'react'
import { articles as initialArticles } from '../data/articles'

const Articles = () => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [articles, setArticles] = useState(initialArticles)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    excerpt: '',
    content: '',
    image: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const newArticle = {
      id: articles.length + 1,
      ...formData,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }
    setArticles([newArticle, ...articles])
    setShowCreateForm(false)
    setFormData({ title: '', author: '', excerpt: '', content: '', image: '' })
  }

  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => setSelectedArticle(null)}
          className="text-green-500 hover:text-green-400 mb-8 flex items-center gap-2 text-sm font-medium"
        >
          ← Back to Articles
        </button>
        <div className="bg-[#1c1c1e] rounded-lg overflow-hidden">
          <img 
            src={selectedArticle.image} 
            alt={selectedArticle.title}
            className="w-full h-96 object-cover"
          />
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4 text-white">{selectedArticle.title}</h1>
            <div className="flex items-center gap-3 text-gray-400 mb-8 text-sm">
              <span>{selectedArticle.author}</span>
              <span>•</span>
              <span>{selectedArticle.date}</span>
            </div>
            <div className="text-gray-300 leading-relaxed text-lg">
              {selectedArticle.content}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Film Articles</h1>
          <p className="text-gray-400">Read and share insights about cinema</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-green-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-green-700 transition"
        >
          {showCreateForm ? 'Cancel' : 'Write Article'}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-[#1c1c1e] p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Publish New Article</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-300">Article Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 rounded-md bg-[#2c2c2e] text-white border border-gray-700 focus:border-green-500 outline-none"
                placeholder="Enter article title"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-300">Author Name</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                className="w-full p-3 rounded-md bg-[#2c2c2e] text-white border border-gray-700 focus:border-green-500 outline-none"
                placeholder="Your name"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-300">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="w-full p-3 rounded-md bg-[#2c2c2e] text-white border border-gray-700 focus:border-green-500 outline-none"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-300">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                className="w-full p-3 rounded-md bg-[#2c2c2e] text-white border border-gray-700 focus:border-green-500 outline-none h-20"
                placeholder="Brief summary"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-300">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full p-3 rounded-md bg-[#2c2c2e] text-white border border-gray-700 focus:border-green-500 outline-none h-48"
                placeholder="Write your article..."
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-8 py-3 rounded-md font-medium hover:bg-green-700 transition"
            >
              Publish Article
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <div key={article.id} className="bg-[#1c1c1e] rounded-lg overflow-hidden hover:transform hover:scale-[1.02] transition cursor-pointer" onClick={() => setSelectedArticle(article)}>
            <div className="h-48 overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold mb-2 text-white line-clamp-2">{article.title}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                <span>{article.author}</span>
                <span>•</span>
                <span>{article.date}</span>
              </div>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
              <span className="text-green-500 hover:text-green-400 font-medium text-sm">
                Read More →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Articles
