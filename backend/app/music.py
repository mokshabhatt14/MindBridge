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
    {"title": "Raabta", "artist": "Arijit Singh", "language": "Hindi", "moods": ["lonely", "hopeful", "calm"], "genre": "Romantic", "reason": "A warm melody that can bring a sense of connection and belonging."},
    {"title": "Ishq Bulaava", "artist": "Sanam Puri, Shipra Goyal", "language": "Hindi", "moods": ["happy", "excited", "hopeful"], "genre": "Pop", "reason": "A bright song for a happy moment or a hopeful fresh start."},
    {"title": "Kar Har Maidaan Fateh", "artist": "Sukhwinder Singh, Shreya Ghoshal", "language": "Hindi", "moods": ["motivated", "stressed", "overwhelmed"], "genre": "Motivational", "reason": "Powerful encouragement for a demanding academic or personal goal."},
    {"title": "Give Me Some Sunshine", "artist": "Suraj Jagan, Sharman Joshi", "language": "Hindi", "moods": ["tired", "sad", "stressed"], "genre": "Acoustic", "reason": "Gentle, honest music for moments when the load feels heavy."},
    {"title": "Ocean", "artist": "Shigga Shay", "language": "Kannada", "moods": ["tired", "calm", "peaceful"], "genre": "Ambient", "reason": "A soothing soundscape for slowing down and recovering."},
    {"title": "Kanasugara", "artist": "Rajesh Krishnan", "language": "Kannada", "moods": ["peaceful", "calm", "hopeful"], "genre": "Melody", "reason": "Soft traditional melody for a quiet, peaceful pause."},
    {"title": "Ninna Poojege Bande Mahadeshwara", "artist": "V. Harikrishna", "language": "Kannada", "moods": ["anxious", "stressed", "calm"], "genre": "Devotional", "reason": "A steady devotional track for a calmer moment."},
    {"title": "Butta Bomma", "artist": "Armaan Malik", "language": "Telugu", "moods": ["happy", "excited", "motivated"], "genre": "Dance", "reason": "Energetic rhythm that matches a cheerful, confident mood."},
    {"title": "Nijanga Nenena", "artist": "Anurag Kulkarni", "language": "Telugu", "moods": ["peaceful", "calm", "tired"], "genre": "Melody", "reason": "Gentle music for rest, reflection and emotional recovery."},
    {"title": "Pillaa Raa", "artist": "Anurag Kulkarni", "language": "Telugu", "moods": ["lonely", "sad", "hopeful"], "genre": "Acoustic", "reason": "A heartfelt song that understands loneliness without rushing you."},
    {"title": "High on Love", "artist": "Sid Sriram", "language": "Tamil", "moods": ["happy", "excited", "hopeful"], "genre": "Pop", "reason": "Warm, uplifting energy for a bright and connected mood."},
    {"title": "Anbe Sivam", "artist": "S. P. Balasubrahmanyam", "language": "Tamil", "moods": ["peaceful", "calm", "hopeful"], "genre": "Devotional", "reason": "A comforting classic that encourages kindness and inner calm."},
    {"title": "Ava Enna", "artist": "Vishal Dadlani", "language": "Tamil", "moods": ["tired", "sad", "lonely"], "genre": "Melody", "reason": "Reflective music for a low-energy moment that needs understanding."},
    {"title": "Kaattu Payale", "artist": "Dhee, Arivu", "language": "Tamil", "moods": ["motivated", "excited", "hopeful"], "genre": "Folk Pop", "reason": "Rhythmic momentum for confidence and determination."},
    {"title": "Malare", "artist": "Vijay Yesudas", "language": "Malayalam", "moods": ["peaceful", "calm", "happy"], "genre": "Melody", "reason": "An easygoing melody for a quiet, positive moment."},
    {"title": "Uyire", "artist": "Gowry Lekshmi", "language": "Malayalam", "moods": ["lonely", "sad", "hopeful"], "genre": "Acoustic", "reason": "Soft, intimate vocals for days that feel emotionally distant."},
    {"title": "Neela Nilave", "artist": "Vijay Yesudas", "language": "Malayalam", "moods": ["anxious", "stressed", "tired"], "genre": "Melody", "reason": "Gentle music that gives tired thoughts a place to rest."},
    {"title": "Phire Esho", "artist": "Anupam Roy", "language": "Bengali", "moods": ["lonely", "sad", "hopeful"], "genre": "Acoustic", "reason": "An intimate song for reflection and a wish to reconnect."},
    {"title": "Tomake Chai", "artist": "Arijit Singh", "language": "Bengali", "moods": ["peaceful", "calm", "lonely"], "genre": "Melody", "reason": "Warm melody for a quiet moment of longing or reflection."},
    {"title": "Teri Mitti", "artist": "B Praak", "language": "Hindi", "moods": ["motivated", "hopeful", "tired"], "genre": "Patriotic", "reason": "Strong emotional energy for recommitting to what matters."},
    {"title": "Kunware", "artist": "Prateek Kuhad", "language": "Hindi", "moods": ["lonely", "sad", "peaceful"], "genre": "Indie", "reason": "Minimal indie music that feels honest and companionable."},
    {"title": "Dil Se Re", "artist": "A.R. Rahman", "language": "Hindi", "moods": ["excited", "motivated", "hopeful"], "genre": "Rock", "reason": "Expansive energy for a bold and motivated state."},
    {"title": "Kabira", "artist": "Tochi Raina, Rekha Bhardwaj", "language": "Hindi", "moods": ["calm", "peaceful", "hopeful"], "genre": "Acoustic", "reason": "Reflective folk-pop for slowing down and finding perspective."},
    {"title": "Masakali", "artist": "Mohit Chauhan", "language": "Hindi", "moods": ["happy", "excited", "calm"], "genre": "Pop", "reason": "Light rhythm and open energy for a free, cheerful moment."},
    {"title": "Ek Tarfa", "artist": "Darshan Raval", "language": "Hindi", "moods": ["sad", "lonely", "tired"], "genre": "Melody", "reason": "A sincere emotional song for a low or lonely afternoon."},
    {"title": "Aararo", "artist": "Hariharan", "language": "Tamil", "moods": ["peaceful", "calm", "tired"], "genre": "Lullaby", "reason": "Gentle, restful music for recovery and quiet."},
    {"title": "Bole Chudiyan", "artist": "Udit Narayan, Sonu Nigam, Alka Yagnik", "language": "Hindi", "moods": ["happy", "excited", "hopeful"], "genre": "Bollywood", "reason": "A familiar celebratory track for joy and togetherness."},
    {"title": "Naatu Naatu", "artist": "Rahul Sipligunj, Kaala Bhairava", "language": "Telugu", "moods": ["excited", "happy", "motivated"], "genre": "Dance", "reason": "Fast, playful energy for movement and a positive reset."},
    {"title": "Suvvi Suvvalamma", "artist": "Mano, S. P. Balasubrahmanyam", "language": "Telugu", "moods": ["peaceful", "calm", "happy"], "genre": "Folk", "reason": "Warm traditional rhythm for comfort and ease."},
    {"title": "Adiye", "artist": "Kapil Kapilan", "language": "Tamil", "moods": ["lonely", "sad", "peaceful"], "genre": "Melody", "reason": "Soft Tamil pop for quiet emotional reflection."},
    {"title": "Suttum Vizhi", "artist": "Vijay, Karthik", "language": "Tamil", "moods": ["motivated", "excited", "hopeful"], "genre": "Dance", "reason": "Bright energy for a confident, forward-moving mood."},
    {"title": "Onakkaga", "artist": "Chinmayi, Pradeep Kumar", "language": "Malayalam", "moods": ["peaceful", "calm", "hopeful"], "genre": "Melody", "reason": "A gentle melody for stillness and emotional clarity."},
    {"title": "Lutt Putt Gaya", "artist": "Arijit Singh", "language": "Hindi", "moods": ["happy", "excited", "hopeful"], "genre": "Pop", "reason": "Easygoing upbeat music for feeling lighter."},
    {"title": "Shiv Kailasho Ke Vasi", "artist": "Hansraj Raghuwanshi", "language": "Hindi", "moods": ["anxious", "stressed", "peaceful"], "genre": "Devotional", "reason": "Calming devotional sound for grounding an anxious moment."},
    {"title": "Jaan'nisar", "artist": "Arijit Singh", "language": "Hindi", "moods": ["sad", "lonely", "tired"], "genre": "Romantic", "reason": "Deep, emotional music for a private reflective moment."},
    {"title": "Blinding Lights", "artist": "The Weeknd", "language": "English", "moods": ["happy", "excited", "motivated"], "genre": "Synth Pop", "reason": "Fast synth-pop energy for movement and excitement."},
    {"title": "Lovely", "artist": "Billie Eilish, Khalid", "language": "English", "moods": ["sad", "lonely", "tired"], "genre": "Alternative", "reason": "A soft song that makes space for difficult feelings."},
    {"title": "Someone You Loved", "artist": "Lewis Capaldi", "language": "English", "moods": ["sad", "lonely", "anxious"], "genre": "Pop", "reason": "Emotionally honest music for connection during sadness."},
    {"title": "Flowers", "artist": "Miley Cyrus", "language": "English", "moods": ["motivated", "hopeful", "happy"], "genre": "Pop", "reason": "Uplifting pop for reclaiming confidence and optimism."},
    {"title": "Golden", "artist": "Jungkook", "language": "Korean", "moods": ["motivated", "happy", "excited"], "genre": "K-Pop", "reason": "Bright, energetic pop for a productive or cheerful mood."},
    {"title": "Spring Day", "artist": "BTS", "language": "Korean", "moods": ["sad", "lonely", "hopeful"], "genre": "K-Pop", "reason": "Reflective pop with a gentle message that difficult seasons can change."},
    {"title": "Blue", "artist": "Yung Kai", "language": "English", "moods": ["calm", "sad", "lonely"], "genre": "Indie", "reason": "Gentle indie pop for quiet, emotionally tender moments."},
]


def spotify_search_url(title, artist):
    return "https://open.spotify.com/search/" + quote_plus(f"{title} {artist}")


def youtube_search_url(title, artist):
    return "https://music.youtube.com/search?q=" + quote_plus(f"{title} {artist}")


def recommend(mood=None, languages=None, limit=6, surprise=False):
    normalized_mood = (mood or "").strip().lower()
    mood_aliases = {
        "peaceful": "calm",
        "exhausted": "tired",
        "okay": "calm",
    }
    normalized_mood = mood_aliases.get(normalized_mood, normalized_mood)
    normalized_languages = {item.strip() for item in (languages or []) if item.strip()}
    if "Any" in normalized_languages:
        normalized_languages = set()

    matching = [
        item for item in CATALOG
        if (not normalized_mood or normalized_mood in item["moods"] or normalized_mood == "okay")
        and (not normalized_languages or item["language"] in normalized_languages)
    ]

    if not matching:
        matching = [
            item for item in CATALOG
            if not normalized_languages or item["language"] in normalized_languages
        ] or list(CATALOG)

    if surprise:
        random.shuffle(matching)
    else:
        matching = sorted(matching, key=lambda item: item["moods"].index(normalized_mood) if normalized_mood in item["moods"] else 99)

    selected_titles = {item["title"] for item in matching}
    if len(matching) < limit:
        language_pool = [
            item for item in CATALOG
            if (not normalized_languages or item["language"] in normalized_languages)
            and item["title"] not in selected_titles
        ]
        for item in language_pool:
            matching.append(item)
            selected_titles.add(item["title"])
            if len(matching) >= limit:
                break
    if len(matching) < limit:
        for item in CATALOG:
            if item["title"] not in selected_titles:
                matching.append(item)
                selected_titles.add(item["title"])
                if len(matching) >= limit:
                    break
    if surprise:
        random.shuffle(matching)

    selected = matching[:limit]
    return [
        {
            **item,
            "spotify_url": spotify_search_url(item["title"], item["artist"]),
            "youtube_url": youtube_search_url(item["title"], item["artist"]),
        }
        for item in selected
    ]
