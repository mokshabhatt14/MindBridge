from urllib.parse import quote_plus
import random


LANGUAGES = [
    "Any", "English", "Hindi", "Kannada", "Telugu", "Tamil", "Malayalam",
    "Bengali", "Marathi", "Punjabi", "Gujarati", "Urdu", "Spanish",
    "Korean", "Japanese", "French",
]


CATALOG = [
    {"title": "Weightless", "artist": "Marconi Union", "language": "English", "moods": ["stressed", "anxious", "overwhelmed", "calm", "tired"], "genre": "Ambient", "reason": "A spacious instrumental sound that can make a stressful moment feel less intense."},
    {"title": "Here Comes the Sun", "artist": "The Beatles", "language": "English", "moods": ["sad", "hopeful", "lonely", "happy"], "genre": "Classic", "reason": "Gentle optimism and familiar warmth for a difficult or slowly improving day."},
    {"title": "Happy", "artist": "Pharrell Williams", "language": "English", "moods": ["happy", "excited", "motivated"], "genre": "Pop", "reason": "An upbeat rhythm for when you want to hold onto or amplify your good energy."},
    {"title": "Fix You", "artist": "Coldplay", "language": "English", "moods": ["sad", "lonely", "tired", "hopeful"], "genre": "Soft Rock", "reason": "A comforting song that acknowledges sadness while gradually moving toward hope."},
    {"title": "Lose Yourself", "artist": "Eminem", "language": "English", "moods": ["motivated", "stressed", "overwhelmed"], "genre": "Hip-Hop", "reason": "A direct, high-energy track for turning a study or personal goal into momentum."},
    {"title": "Kun Faya Kun", "artist": "A.R. Rahman, Javed Ali, Mohit Chauhan", "language": "Hindi", "moods": ["anxious", "stressed", "sad", "hopeful"], "genre": "Spiritual", "reason": "Soulful, reflective music that gives anxious thoughts room to settle."},
    {"title": "Iktara", "artist": "Amit Trivedi, Kavita Seth", "language": "Hindi", "moods": ["lonely", "sad", "calm", "hopeful"], "genre": "Acoustic", "reason": "A soft and intimate song that understands quiet, reflective moods."},
    {"title": "Jeene Laga Hoon", "artist": "Atif Aslam, Shreya Ghoshal", "language": "Hindi", "moods": ["happy", "hopeful", "excited"], "genre": "Bollywood", "reason": "Warm melody and bright energy for a hopeful or happy moment."},
    {"title": "Zinda", "artist": "Siddharth Mahadevan", "language": "Hindi", "moods": ["motivated", "tired", "overwhelmed"], "genre": "Motivational", "reason": "A motivating song that encourages you to continue, even when progress feels difficult."},
    {"title": "Belageddu", "artist": "Vijay Prakash", "language": "Kannada", "moods": ["happy", "calm", "hopeful"], "genre": "Folk", "reason": "A light and scenic melody that can bring a sense of ease and openness."},
    {"title": "Neene Naguva", "artist": "S. P. Balasubrahmanyam", "language": "Kannada", "moods": ["sad", "lonely", "calm"], "genre": "Melody", "reason": "A gentle classic for moments when comfort matters more than forced positivity."},
    {"title": "Vismaya", "artist": "Sanjith Hegde", "language": "Kannada", "moods": ["motivated", "happy", "excited"], "genre": "Pop", "reason": "Fresh, positive energy to complement an active and motivated mood."},
    {"title": "Samajavaragamana", "artist": "Sid Sriram", "language": "Telugu", "moods": ["happy", "calm", "hopeful"], "genre": "Melody", "reason": "A warm, melodic track that feels light without ignoring emotional depth."},
    {"title": "Inkem Inkem", "artist": "Sid Sriram", "language": "Telugu", "moods": ["lonely", "sad", "hopeful"], "genre": "Romantic", "reason": "A mellow melody for reflective moments and quiet companionship."},
    {"title": "Vachindamma", "artist": "Sid Sriram", "language": "Telugu", "moods": ["excited", "happy", "motivated"], "genre": "Pop", "reason": "Bright rhythm and vocal energy for a confident, upbeat state."},
    {"title": "Ennavale", "artist": "Unni Krishnan", "language": "Tamil", "moods": ["lonely", "sad", "calm"], "genre": "Melody", "reason": "A soft, emotionally rich song that offers companionship without pressure."},
    {"title": "Munbe Vaa", "artist": "Shreya Ghoshal, Naresh Iyer", "language": "Tamil", "moods": ["calm", "lonely", "hopeful"], "genre": "Romantic", "reason": "Comforting melody and familiar imagery for a quiet reflective mood."},
    {"title": "Vaathi Coming", "artist": "Anirudh Ravichander", "language": "Tamil", "moods": ["motivated", "excited", "happy"], "genre": "Dance", "reason": "High-energy music for a focused, celebratory burst of momentum."},
    {"title": "Ennile Ellaam", "artist": "Shreya Ghoshal", "language": "Malayalam", "moods": ["sad", "lonely", "hopeful"], "genre": "Melody", "reason": "Gentle music that leaves space for difficult feelings while offering hope."},
    {"title": "Jimmiki Kammal", "artist": "Shaan Rahman, Vineeth Sreenivasan", "language": "Malayalam", "moods": ["happy", "excited", "motivated"], "genre": "Dance", "reason": "Joyful rhythm for a lively mood or a needed reset."},
    {"title": "Amaro Porano Jaha Chay", "artist": "Rabindranath Tagore", "language": "Bengali", "moods": ["calm", "hopeful", "sad"], "genre": "Classic", "reason": "A timeless reflective melody for calm contemplation."},
    {"title": "Tumi Jake Bhalo Basho", "artist": "Anupam Roy", "language": "Bengali", "moods": ["lonely", "sad", "calm"], "genre": "Acoustic", "reason": "Intimate lyrics and a soft arrangement for moments of emotional distance."},
    {"title": "Choo Lo", "artist": "The Local Train", "language": "Hindi", "moods": ["hopeful", "motivated", "anxious"], "genre": "Indie", "reason": "Restless indie energy that fits uncertainty while pushing toward possibility."},
    {"title": "Heer", "artist": "Harshdeep Kaur", "language": "Punjabi", "moods": ["sad", "lonely", "hopeful"], "genre": "Sufi", "reason": "A deep, comforting vocal performance for emotional reflection."},
    {"title": "Patakha Guddi", "artist": "Nooran Sisters", "language": "Punjabi", "moods": ["motivated", "excited", "hopeful"], "genre": "Folk", "reason": "Powerful folk-pop energy for reclaiming confidence and momentum."},
    {"title": "Gallan Goodiyaan", "artist": "Yashita Sharma, Manish Kumar Tipu", "language": "Hindi", "moods": ["happy", "excited", "motivated"], "genre": "Dance", "reason": "A social, celebratory song that can lighten the atmosphere."},
    {"title": "Tu Hai", "artist": "Vishal Mishra", "language": "Hindi", "moods": ["lonely", "sad", "hopeful"], "genre": "Soft Pop", "reason": "Soft reassurance and melody for a difficult or lonely moment."},
    {"title": "Zara Zara", "artist": "Bombay Jayashri", "language": "Hindi", "moods": ["calm", "sad", "lonely"], "genre": "Melody", "reason": "Slow, familiar phrasing that feels gentle rather than demanding."},
    {"title": "Laung Laachi", "artist": "Maninder Buttar", "language": "Punjabi", "moods": ["happy", "excited", "calm"], "genre": "Folk Pop", "reason": "Light Punjabi rhythm for a relaxed positive mood."},
    {"title": "Tere Bin", "artist": "Atif Aslam", "language": "Urdu", "moods": ["sad", "lonely", "calm"], "genre": "Melody", "reason": "A quiet, emotional melody for reflection and calm connection."},
    {"title": "Apsara Aali", "artist": "Ajay-Atul, Bela Shende", "language": "Marathi", "moods": ["happy", "excited", "hopeful"], "genre": "Folk", "reason": "Celebratory folk rhythm for an upbeat or hopeful moment."},
    {"title": "Saawali Jyoti", "artist": "Shankar Mahadevan", "language": "Marathi", "moods": ["calm", "sad", "lonely"], "genre": "Melody", "reason": "A warm Marathi melody that offers quiet companionship."},
    {"title": "Mareez-e-Ishq", "artist": "Arijit Singh", "language": "Gujarati", "moods": ["sad", "lonely", "hopeful"], "genre": "Melody", "reason": "A reflective melody for feeling and processing emotions at your own pace."},
    {"title": "Najanene", "artist": "Asees Kaur", "language": "Gujarati", "moods": ["happy", "calm", "excited"], "genre": "Folk Pop", "reason": "Bright Gujarati pop energy for a positive or relaxed mood."},
    {"title": "Afreen Afreen", "artist": "Rahat Fateh Ali Khan, Momina Mustehsan", "language": "Urdu", "moods": ["calm", "hopeful", "happy"], "genre": "Sufi", "reason": "Spacious vocals and melody that encourage stillness and presence."},
    {"title": "Namo Namo", "artist": "Amit Trivedi", "language": "Hindi", "moods": ["stressed", "anxious", "overwhelmed"], "genre": "Devotional", "reason": "A steady, uplifting arrangement that can help create a calm pause."},
    {"title": "Channa Mereya", "artist": "Arijit Singh", "language": "Hindi", "moods": ["sad", "lonely", "tired"], "genre": "Melody", "reason": "An emotionally expressive song for sitting with sadness rather than suppressing it."},
    {"title": "Colores", "artist": "J Balvin", "language": "Spanish", "moods": ["happy", "excited", "motivated"], "genre": "Reggaeton", "reason": "Vivid rhythm and bright color for an energetic reset."},
    {"title": "Corazón Sin Cara", "artist": "Prince Royce", "language": "Spanish", "moods": ["hopeful", "lonely", "sad"], "genre": "Bachata", "reason": "A reassuring song about acceptance and inner worth."},
    {"title": "Spring Day", "artist": "BTS", "language": "Korean", "moods": ["sad", "lonely", "hopeful"], "genre": "K-Pop", "reason": "Reflective pop with a gentle message that difficult seasons can change."},
    {"title": "Lemon", "artist": "Kenshi Yonezu", "language": "Japanese", "moods": ["sad", "lonely", "calm"], "genre": "J-Pop", "reason": "A reflective, moving melody for grief or emotional distance."},
    {"title": "Gurenge", "artist": "LiSA", "language": "Japanese", "moods": ["motivated", "tired", "overwhelmed"], "genre": "Anime Rock", "reason": "Powerful momentum for when you need to take the next step."},
    {"title": "Dernière danse", "artist": "Indila", "language": "French", "moods": ["sad", "lonely", "hopeful"], "genre": "Pop", "reason": "Atmospheric music that validates melancholy while holding onto motion."},
    {"title": "On écrit sur les murs", "artist": "Kids United", "language": "French", "moods": ["motivated", "hopeful", "happy"], "genre": "Pop", "reason": "Collective, uplifting energy about creating change together."},
]


def spotify_search_url(title, artist):
    return "https://open.spotify.com/search/" + quote_plus(f"{title} {artist}")


def youtube_search_url(title, artist):
    return "https://music.youtube.com/search?q=" + quote_plus(f"{title} {artist}")


def recommend(mood=None, languages=None, limit=6, surprise=False):
    normalized_mood = (mood or "").strip().lower()
    normalized_languages = {item.strip() for item in (languages or []) if item.strip()}
    if "Any" in normalized_languages:
        normalized_languages = set()

    matching = [
        item for item in CATALOG
        if (not normalized_mood or normalized_mood in item["moods"] or normalized_mood == "okay")
        and (not normalized_languages or item["language"] in normalized_languages)
    ]

    if surprise or not matching:
        matching = [
            item for item in CATALOG
            if not normalized_languages or item["language"] in normalized_languages
        ] or list(CATALOG)

    if surprise:
        random.shuffle(matching)
    else:
        matching = sorted(matching, key=lambda item: item["moods"].index(normalized_mood) if normalized_mood in item["moods"] else 99)

    selected = matching[:limit]
    return [
        {
            **item,
            "spotify_url": spotify_search_url(item["title"], item["artist"]),
            "youtube_url": youtube_search_url(item["title"], item["artist"]),
        }
        for item in selected
    ]
