// TMDB IDs for each movie — used to fetch live data from TMDB
export const movies = [
  {
    id: 1,
    tmdbId: 872585,
    title: "Oppenheimer",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    rating: "8.1",
    year: "2023",
    genre: "Drama",
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr.", "Matt Damon"],
    fullReview: "Christopher Nolan's Oppenheimer is a masterful biographical epic that explores the life of J. Robert Oppenheimer, the father of the atomic bomb. Cillian Murphy delivers a career-defining performance, capturing both the brilliance and the inner turmoil of a man who changed the world forever. The film's non-linear narrative weaves through different time periods, from Oppenheimer's early academic career to the Manhattan Project and the subsequent security hearings. Robert Downey Jr. is exceptional as Lewis Strauss, providing a compelling counterpoint to Murphy's Oppenheimer. The cinematography by Hoyte van Hoytema is stunning, shot entirely on IMAX film, creating an immersive visual experience. Ludwig Göransson's score perfectly complements the tension and drama. What makes this film extraordinary is how it grapples with complex moral questions about scientific responsibility and the consequences of innovation. The Trinity test sequence remains one of the most powerful moments in recent cinema."
  },
  {
    id: 2,
    tmdbId: 693134,
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against those who destroyed his family. An epic sci-fi adventure of destiny, power, and survival.",
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    rating: "8.5",
    year: "2024",
    genre: "Sci-Fi",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Austin Butler"],
    fullReview: "Denis Villeneuve's Dune: Part Two is a monumental achievement in science fiction cinema. Building on the foundation of the first film, this sequel expands the scope and deepens the mythology of Frank Herbert's universe. Timothée Chalamet's transformation into a messianic figure is compelling and nuanced, while Zendaya finally gets the screen time she deserves as Chani. Austin Butler is menacing as Feyd-Rautha, bringing a terrifying presence to every scene. The action sequences are breathtaking, particularly the sandworm riding scenes that feel both visceral and otherworldly. Greig Fraser's cinematography captures the harsh beauty of Arrakis in stunning detail. Hans Zimmer's score is even more powerful than the first film, blending traditional instruments with electronic elements."
  },
  {
    id: 3,
    tmdbId: 414906,
    title: "The Batman",
    description: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a killer known as the Riddler.",
    poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    rating: "7.8",
    year: "2022",
    genre: "Thriller",
    director: "Matt Reeves",
    cast: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano", "Colin Farrell"],
    fullReview: "Matt Reeves delivers a fresh take on the Dark Knight with The Batman, a gritty detective noir that emphasises Bruce Wayne's role as the World's Greatest Detective. Robert Pattinson brings a brooding intensity to the role, portraying a younger, more vulnerable Batman still finding his way. Paul Dano's Riddler is genuinely unsettling, reimagined as a Zodiac-style serial killer. Zoë Kravitz is excellent as Selina Kyle, bringing depth and complexity to Catwoman. The film's visual style is heavily influenced by film noir, with Greig Fraser's cinematography creating a perpetually rain-soaked, shadowy Gotham. Michael Giacchino's score is haunting and memorable. At nearly three hours, the film rewards patient viewers with a complex plot about corruption and vengeance."
  },
  {
    id: 4,
    tmdbId: 361743,
    title: "Top Gun: Maverick",
    description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, training a new generation of pilots for a specialized mission.",
    poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/AkB5jtUABOvLuXbYmHnOdJWJJXG.jpg",
    rating: "8.2",
    year: "2022",
    genre: "Adventure",
    director: "Joseph Kosinski",
    cast: ["Tom Cruise", "Miles Teller", "Jennifer Connelly", "Jon Hamm"],
    fullReview: "Top Gun: Maverick is a rare sequel that not only honours its predecessor but surpasses it in every way. Tom Cruise delivers one of his best performances, bringing emotional depth to Pete 'Maverick' Mitchell. The aerial sequences are absolutely breathtaking, shot with real fighter jets and practical effects that put CGI to shame. Miles Teller is excellent as Rooster, bringing genuine emotion to his complicated relationship with Maverick. The film balances spectacular action with genuine character development and emotional stakes. Hans Zimmer and Lorne Balfe's score perfectly complements Harold Faltermeyer's iconic themes. This is blockbuster filmmaking at its absolute best."
  },
  {
    id: 5,
    tmdbId: 545611,
    title: "Everything Everywhere All at Once",
    description: "A middle-aged Chinese immigrant is swept up in an insane adventure where she alone can save the world by exploring other universes.",
    poster: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/ss0Os3uWJfQAENILHZUdX8Tt1OC.jpg",
    rating: "7.8",
    year: "2022",
    genre: "Sci-Fi",
    director: "Daniel Kwan, Daniel Scheinert",
    cast: ["Michelle Yeoh", "Stephanie Hsu", "Ke Huy Quan", "Jamie Lee Curtis"],
    fullReview: "Everything Everywhere All at Once is a wildly inventive, deeply emotional film that defies categorization. The Daniels have created something truly unique, blending martial arts action, sci-fi concepts, absurdist humor, and family drama into a cohesive whole. Michelle Yeoh gives the performance of her career as Evelyn. Ke Huy Quan's comeback performance is heartwarming and powerful. Despite the chaotic premise, the emotional core about family, acceptance, and finding meaning in life remains clear and affecting. This is bold, original filmmaking that takes big swings and connects on every level."
  },
  {
    id: 6,
    tmdbId: 1008616,
    title: "The Holdovers",
    description: "A curmudgeonly instructor at a New England prep school is forced to remain on campus during Christmas break to babysit students with nowhere to go.",
    poster: "https://image.tmdb.org/t/p/w500/VHmqSihBLBnlTfnCBZRtFLkKd7.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/qbpYUkRfLBdEcFaXFKTfnuPygxT.jpg",
    rating: "7.9",
    year: "2023",
    genre: "Drama",
    director: "Alexander Payne",
    cast: ["Paul Giamatti", "Da'Vine Joy Randolph", "Dominic Sessa"],
    fullReview: "The Holdovers is a warm, character-driven film that recalls the best of 1970s cinema. Alexander Payne crafts a story about three lonely people finding connection during the Christmas season. Paul Giamatti is phenomenal as Paul Hunham, a bitter classics teacher whose gruff exterior hides deep pain. Da'Vine Joy Randolph delivers a heartbreaking performance as Mary. The film's 1970s setting is perfectly realized. The screenplay is sharp and witty, with genuine emotional depth beneath the humor. This is the kind of mid-budget, adult-oriented drama we need more of."
  },
  {
    id: 7,
    tmdbId: 724495,
    title: "Killers of the Flower Moon",
    description: "Members of the Osage tribe are murdered under mysterious circumstances in the 1920s, sparking a major F.B.I. investigation involving J. Edgar Hoover.",
    poster: "https://image.tmdb.org/t/p/w500/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/f6C4nqCkmEkGiRuXMbfF87VR3Oy.jpg",
    rating: "7.6",
    year: "2023",
    genre: "Drama",
    director: "Martin Scorsese",
    cast: ["Leonardo DiCaprio", "Robert De Niro", "Lily Gladstone", "Jesse Plemons"],
    fullReview: "Martin Scorsese's Killers of the Flower Moon is a sprawling, devastating epic about greed, betrayal, and the systematic exploitation of the Osage Nation. Leonardo DiCaprio delivers a complex performance as Ernest Burkhart, a man torn between love and complicity in evil. Robert De Niro is chilling as William Hale. Lily Gladstone is the heart of the film as Mollie Burkhart, bringing dignity and strength to her portrayal. The film's three-and-a-half-hour runtime allows Scorsese to fully explore the historical tragedy and its human cost. This is mature, important filmmaking that confronts a dark chapter of American history with unflinching honesty."
  },
  {
    id: 8,
    tmdbId: 346698,
    title: "Barbie",
    description: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land until they get a chance to go to the real world.",
    poster: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/ctMserH8g2SeOAnCmVqqITce7oc.jpg",
    rating: "7.0",
    year: "2023",
    genre: "Comedy",
    director: "Greta Gerwig",
    cast: ["Margot Robbie", "Ryan Gosling", "America Ferrera", "Will Ferrell"],
    fullReview: "Greta Gerwig's Barbie is a delightful surprise, a smart and subversive comedy that works on multiple levels. Margot Robbie is perfect as Stereotypical Barbie, bringing both comedic timing and genuine emotion to the role. Ryan Gosling steals every scene as Ken, delivering a hilarious performance that's also surprisingly poignant. The production design is spectacular, creating a candy-colored Barbie Land. The film cleverly explores themes of identity, feminism, and existential crisis. America Ferrera's monologue about the contradictions of being a woman is powerful and resonant. This is blockbuster filmmaking with brains and personality."
  }
]

export const getMovieById = (id) => movies.find(m => m.id === parseInt(id))
export const getMoviesByGenre = (genre) => {
  if (!genre || genre === 'All') return movies
  return movies.filter(m => m.genre === genre)
}
export const genres = ['All', 'Drama', 'Sci-Fi', 'Thriller', 'Adventure', 'Comedy']
