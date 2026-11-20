// i18n.js — Hebrew version of the Game Hub.
// The site is written in English; when Hebrew is on, this file swaps the text on the page
// (including text that appears later, like toasts and leaderboards) and turns the page right-to-left.
// To fix or add a translation, edit the lists below.

const KEY = "gh_lang";
export function getLang() {
    try {
        const saved = localStorage.getItem(KEY);
        if (saved === "he" || saved === "en") return saved;
    } catch (e) {}
    return (navigator.language || "").toLowerCase().startsWith("he") ? "he" : "en";
}
export function setLang(l) {
    try { localStorage.setItem(KEY, l); } catch (e) {}
    location.reload();
}

// ---------- Game names ----------
const NAMES = {
    "Noametry": "נועמטרי", "Space Shooter": "יורה החלל", "2048": "2048", "Brick Smash": "מנפץ הלבנים", "Memory Match": "משחק הזיכרון",
    "Subway Runner": "רץ הרכבת", "Dino Run": "ריצת הדינו", "Flappy Chicken": "התרנגולת המעופפת", "Sky Hopper": "קופץ השמיים", "Snake": "נחש", "Maze Muncher": "זולל המבוך",
    "Block Drop": "נפילת הבלוקים", "Pixel Jumper": "קופץ הפיקסלים", "Bubble Blaster": "מפוצץ הבועות", "Chess": "שחמט",
    "Paddle Battle": "קרב המחבטים", "Four in a Row": "ארבע בשורה", "Tic-Tac-Toe": "איקס עיגול", "Mine Finder": "מוצא המוקשים", "Mole Mash": "הכה את החפרפרת",
    "Color Echo": "הד הצבעים", "Stack Tower": "מגדל הבלוקים", "Space Rocks": "סלעי החלל", "Math Blitz": "בליץ חשבון", "Typing Rain": "גשם של מילים",
    "Motor Racing": "מרוץ אופנועים", "Soccer": "כדורגל",
    "Penalty Shootout": "דו־קרב פנדלים", "Keepy Uppy": "ג'אגלינג", "Mini Golf": "מיני גולף", "Bowling": "באולינג", "Tennis": "טניס",
    "Air Hockey": "הוקי אוויר", "Hoop Shot": "קליעה לסל", "Gem Swap": "החלפת יהלומים", "Sky Climber": "מטפס השמיים", "Fruit Slash": "חיתוך פירות",
    "Header Hero": "מלך הנגיחות", "5-a-Side": "כדורגל 5 על 5", "5-a-Side Football": "כדורגל 5 על 5", "Noam Football": "הכדורגל של נועם", "Noam Pool": "הביליארד של נועם", "Bubble Pop": "פיצוץ בועות", "Block Fit": "בלוק פיט", "Fruit Merge": "מיזוג פירות", "Snake Arena": "זירת הנחשים", "Road Hopper": "קפצן הכביש", "Hill Rider": "רוכב הגבעות", /*ngn:dropmerge*/"Drop Merge": "הפל ומזג", /*ngn:colorlines*/"Color Lines": "קווי צבע", /*ngn:sumopush*/"Sumo Push": "דחיפת סומו", /*ngn:timberchop*/"Timber Chop": "חוטב העצים", /*ngn:codebreaker*/"Code Breaker": "פורץ הקודים", /*ngn:fruitcatcher*/"Fruit Catcher": "תופס הפירות", /*ngn:carsoccer*/"Car Soccer": "כדורגל מכוניות", /*ngn:ultimatetictactoe*/"Ultimate Tic-Tac-Toe": "איקס עיגול אולטימטיבי", /*ngn:goldminer*/"Gold Miner": "כורה הזהב", /*ngn:watersort*/"Water Sort": "מיון מים", /*ngn:dodge*/"Dodge!": "התחמקות!", /*ngn:slimevolley*/"Slime Volley": "כדורעף סליים", /*ngn:ninemensmorris*/"Nine Men's Morris": "טחנה", /*ngn:spotthedifference*/"Spot the Difference": "מצאו את ההבדלים", /*ngn:turbokart*/"Turbo Kart": "טורבו קארט", /*ngn:jigsaw*/"Jigsaw": "פאזל", /*ngn:castlesmash*/"Castle Smash": "ניפוץ טירות", /*ngn:bombmaze*/"Bomb Maze": "מבוך הפצצות", /*ngn:boxpusher*/"Box Pusher": "דוחף הארגזים", /*ngn:ludo*/"Ludo": "לודו", /*ngn:pinball*/"Pinball": "פינבול", /*ngn:neonslope*/"Neon Slope": "מדרון ניאון", /*ngn:parkingpro*/"Parking Pro": "חנייה מקצועית", /*ngn:blackhole*/"Black Hole": "חור שחור", /*ngn:sandbox*/"Sand Box": "ארגז חול", /*ngn:targetrush*/"Target Rush": "מטרות מהירות", /*ngn:beatmaker*/"Beat Maker": "יוצר הביטים", /*ngn:colorhop*/"Color Hop": "קפיצת צבעים", /*ngn:zombiesurvival*/"Zombie Survival": "הישרדות זומבים", /*ngn:burgerchef*/"Burger Chef": "שף המבורגרים", /*ngn:crazyeights*/"Crazy Eights": "שמיניות משוגעות", /*ngn:paintterritory*/"Paint Territory": "צביעת שטח", /*ngn:celleater*/"Cell Eater": "אוכל התאים", /*ngn:fireworks*/"Fireworks": "זיקוקים", /*ngn:dicefive*/"Dice Five": "חמש קוביות", /*ngn:skislope*/"Ski Slope": "מדרון סקי", /*ngn:balloonpop*/"Balloon Pop": "פיצוץ בלונים", /*ngn:snakesladders*/"Snakes & Ladders": "סולמות ונחשים", /*ngn:archery*/"Archery": "קשתות", /*ngn:jetpackdash*/"Jetpack Dash": "דהירת ג'טפאק", /*ngn:brickballs*/"Brick Balls": "כדורים ולבנים", /*ngn:memorygrid*/"Memory Grid": "רשת הזיכרון", /*ngn:higherlower*/"Higher or Lower": "גבוה או נמוך", /*ngn:reactiontest*/"Reaction Test": "מבחן תגובה", /*ngn:colortrick*/"Color Trick": "טריק הצבעים", /*ngn:plinko*/"Plinko": "פלינקו", /*ngn:darts*/"Darts": "חצים", /*ngn:moonlander*/"Moon Lander": "נחיתה על הירח", /*ngn:lightbikes*/"Light Bikes": "אופנועי אור", /*ngn:alieninvaders*/"Alien Invaders": "פולשים מהחלל", /*ngn:citydefender*/"City Defender": "מגן העיר", /*ngn:stickbridge*/"Stick Bridge": "גשר המקל", /*ngn:pianotiles*/"Piano Tiles": "אריחי פסנתר", /*ngn:knifethrow*/"Knife Throw": "זריקת סכינים", /*ngn:helixdrop*/"Helix Drop": "נפילת ספירלה", /*ngn:tilematch*/"Tile Match": "התאמת אריחים", /*ngn:picturecross*/"Picture Cross": "תמונה נסתרת", /*ngn:trafficjam*/"Traffic Jam": "פקק תנועה", /*ngn:pipeconnect*/"Pipe Connect": "חיבור צינורות", /*ngn:wordscramble*/"Word Scramble": "ערבוב מילים", /*ngn:hangman*/"Balloon Hangman": "תלוי בבלונים", /*ngn:slidepuzzle*/"Slide Puzzle": "פאזל הזזה", /*ngn:hanoi*/"Tower of Hanoi": "מגדלי האנוי", /*ngn:mancala*/"Mancala": "מנקלה", /*ngn:lightsout*/"Lights Out": "כיבוי אורות", /*ngn:fiveinarow*/"Five in a Row": "חמש ברצף", /*ngn:dotsboxes*/"Dots and Boxes": "נקודות וריבועים", /*ngn:reversi*/"Reversi": "רברסי", /*ngn:ballsort*/"Ball Sort": "מיון כדורים", "Checkers": "דמקה", "Sudoku": "סודוקו", "Solitaire": "סוליטר", "Sea Battle": "קרב ימי",
    "Castle Defense": "הגנת הטירה", "Word Guess": "נחשו את המילה", "Word Search": "תפזורת", "Flag Quiz": "חידון דגלים", "Rhythm Tap": "קצב",
    "Idle Bakery": "המאפייה", "Pixel Paint": "ציור פיקסלים", "Tank Battle": "קרב טנקים", "Fishing Frenzy": "טירוף דיג", "Maze Escape": "בריחה מהמבוך"
};
const gn = (n) => NAMES[n] || n;
const UNITS = { points: "נקודות", pipes: "צינורות", goals: "גולים", blocks: "קומות", rounds: "סיבובים", "wins in a row": "ניצחונות ברצף", cupcakes: "קאפקייקס" };

// ---------- Whole sentences (matched on an element's full text, so word order can change) ----------
const BLOCKS = {
    "My Hub Pet": "חיית <span>המחמד שלי</span>",
    "Level Maker": "יוצר <span>השלבים</span>",
    "Player Levels": "שלבי <span>שחקנים</span>",
    "Game Studio": "סטודיו <span>משחקים</span>",
    "Made by Players": "נוצר ע״י <span>שחקנים</span>",
    "Arcade World": "עולם <span>הארקייד</span>",
    "When your pet becomes a Teen, it evolves depending on the games you've played most.": "כשחיית המחמד הופכת לנער, היא מתפתחת לפי המשחקים שאתם משחקים הכי הרבה.",
    "Every game you finish feeds your pet and gives it 10 XP. Your first game hatches the egg.": "<b>כל משחק שאתם מסיימים מאכיל את חיית המחמד</b> ונותן לה 10 XP. המשחק הראשון שלכם בוקע את הביצה.",
    "It grows from Baby to Kid, Teen, Grown-up and finally Legend.": "היא גדלה מתינוק לילד, נער, בוגר ובסוף אגדה.",
    "As a Teen it evolves: play sports for Sporty, puzzles and brain games for Brainy, arcade games for Zappy, or word and creative games for Artsy.": "כנער היא מתפתחת: שחקו ספורט ל<b>ספורטאי</b>, פאזלים ומשחקי חשיבה ל<b>גאון</b>, משחקי ארקייד ל<b>זאפי</b>, או משחקי מילים ויצירה ל<b>אמן</b>.",
    "Pat it and give it a treat (once an hour) to keep it happy. It gets a bit hungry while you're away, but it never gets sick or goes away.": "לטפו אותה ותנו לה חטיף (פעם בשעה) כדי שתהיה שמחה. היא נהיית קצת רעבה כשאתם לא כאן, אבל היא אף פעם לא חולה ולא הולכת.",
    "Unlock accessories by earning achievements or by growing your pet.": "פתחו אביזרים על ידי השגת הישגים או גידול חיית המחמד.",
    "Log in and your pet is saved to your account, so it follows you to other devices.": "התחברו וחיית המחמד נשמרת בחשבון, כך שהיא איתכם גם במכשירים אחרים.",
    "How to make a level: pick a tool and click on the grid. Spikes kill, blocks can be landed on (but crash into their sides), and yellow jump pads give a super jump. Press ▶ Test to play it (Space, click or tap to jump, hold to keep jumping). When you beat your own level, the 🚀 Publish button unlocks so other players can find it on the Player levels page. You can also send a 🔗 Share link to a friend without publishing. Your level saves by itself in this browser.": "<b>איך יוצרים שלב:</b> בחרו כלי ולחצו על הלוח. קוצים הורגים, על קוביות אפשר לנחות (אבל מתרסקים בצד שלהן), ומשטחי קפיצה צהובים נותנים קפיצת־על. לחצו <b>▶ בדיקה</b> כדי לשחק (רווח, קליק או נגיעה לקפיצה, להחזיק כדי להמשיך לקפוץ). כשתעברו את השלב שלכם, כפתור <b>🚀 פרסום</b> נפתח, ושחקנים אחרים יוכלו למצוא אותו ב<a href=\"/levels\" style=\"color:var(--accent-2)\">שלבי שחקנים</a>. אפשר גם לשלוח <b>🔗 קישור</b> לחבר בלי לפרסם. השלב נשמר לבד בדפדפן.",
    "Pick a game to start from. Then change the code and watch your game change. Look for the comments that say TRY for ideas.": "בחרו משחק להתחיל ממנו. אחר כך שנו את הקוד ותראו את המשחק משתנה. חפשו הערות שכתוב בהן <b>TRY</b> לרעיונות.",
    "Your game will appear in the Made by Players arcade with your name, after Noam checks it. That usually takes a day or two.": "המשחק שלכם יופיע בארקייד <a href=\"/made\" style=\"color:var(--accent-2)\">נוצר ע״י שחקנים</a> עם השם שלכם, אחרי שנועם יבדוק אותו. זה לוקח בדרך כלל יום־יומיים.",
    "Please don't put your real name, address, school or photos in your game. Games with rude words or that copy someone else's game won't be approved.": "בבקשה אל תכניסו למשחק את השם האמיתי, כתובת, בית ספר או תמונות. משחקים עם מילים לא יפות או שמעתיקים משחק של מישהו אחר לא יאושרו.",
    "Every game here was made in the free Game Studio by a player, many of them kids learning to code. Play them, like the ones you enjoy, and press Remix to make your own version.": "כל משחק כאן נוצר בסטודיו המשחקים החינמי על ידי שחקן, הרבה מהם ילדים שלומדים לתכנת. שחקו, תנו לייק למשחקים שאהבתם, ולחצו רמיקס כדי ליצור גרסה משלכם.",
    "🎮 If the keyboard doesn't work, click on the game first. Made by a player in the Game Studio and checked by Noam before it was added. Something wrong with this game? Tell Noam.": "🎮 אם המקלדת לא עובדת, לחצו קודם על המשחק. נוצר על ידי שחקן בסטודיו המשחקים ונבדק על ידי נועם לפני שנוסף. משהו לא בסדר במשחק? <a href=\"mailto:noam@noamtoder.com\" style=\"color:var(--accent-2)\">ספרו לנועם</a>.",
    "Walk around with the arrow keys or WASD, or tap where you want to go. Walk up to a machine and press E, Space or the Play button to play it. There are 5 hidden coins somewhere in the arcade. Find them all to open the secret room!": "הסתובבו עם החצים או WASD, או געו במקום שאליו תרצו ללכת. גשו למכונה ולחצו <b>E</b>, <b>רווח</b> או על כפתור המשחק כדי לשחק. יש <b>5 מטבעות מוחבאים</b> איפשהו בארקייד. מצאו את כולם כדי לפתוח את החדר הסודי!",
    // homepage
    "🎮 16 games · no downloads · free account saves your scores": "🎮 16 משחקים · בלי הורדות · חשבון חינמי שומר את השיאים שלך",
    "Welcome to Noam's Game Hub!": "ברוכים הבאים<br>למשחקים של נועם!",
    "Noam's Game Hub is a free collection of browser games that Noam built himself using HTML, CSS and JavaScript. Every game runs right in your browser on a computer, tablet or phone. There's nothing to download or install, and no app store needed.":
        "המשחקים של נועם הם אוסף חינמי של משחקי דפדפן שנועם בנה בעצמו עם HTML,‏ CSS ו־JavaScript. כל משחק רץ ישר בדפדפן, במחשב, בטאבלט או בטלפון. אין מה להוריד ואין מה להתקין.",
    "The hub started as a coding project and keeps growing. New games are added and old ones are improved all the time. Some games are quick arcade challenges like Dino Run and Space Shooter, and others make you think, like 2048, Memory Match and Chess.":
        'האתר התחיל כפרויקט תכנות והוא כל הזמן גדל. מוסיפים משחקים חדשים ומשפרים את הישנים. יש משחקי ארקייד מהירים כמו <a href="/DinoGame/dinogame">ריצת הדינו</a> ו<a href="/SpaceShooter/spaceshooter">יורה החלל</a>, ויש משחקים שגורמים לחשוב, כמו <a href="/Game2048/2048">2048</a>, <a href="/Memory/memory">משחק הזיכרון</a> ו<a href="/Chess/chess">שחמט</a>.',
    "Make a free account and your best score in every game is saved to your profile, so you can see how much you've improved.":
        'פתחו חשבון חינמי, והשיא שלכם בכל משחק יישמר ב<a href="/profile">פרופיל</a> כדי שתוכלו לראות כמה השתפרתם.',
    "For ₪10, once, you get no ads and a few extra games. See what's included.":
        'ב־10 ₪, פעם אחת, אין פרסומות ויש עוד משחקים. <a href="/premium">מה מקבלים?</a>',
    "How do I report a bug or suggest a game?": "איך מדווחים על באג או מציעים משחק?",
    "Email noam@noamtoder.com. Ideas for new games are always welcome!": 'שלחו מייל ל־<a href="mailto:noam@noamtoder.com">noam@noamtoder.com</a>. רעיונות למשחקים חדשים תמיד מתקבלים בשמחה!',
    "Made with ❤️ by Noam · About me · NoamChat · NoamBrowser · More websites · Articles · Leaderboards · Premium · Terms · Privacy · Contact":
        'נבנה באהבה ❤️ על ידי נועם · <a href="/about">עליי</a> · <a href="/chat/">NoamChat</a> · <a href="/noambrowser">NoamBrowser</a> · <a href="/Websites/">עוד אתרים</a> · <a href="/articles/">כתבות</a> · <a href="/leaderboard">טבלאות שיאים</a> · <a href="/premium">פרימיום</a> · <a href="/terms">תנאי שימוש</a> · <a href="/privacy">פרטיות</a> · <a href="mailto:noam@noamtoder.com">צור קשר</a>',
    "Made with ❤️ by Noam · Back to the Game Hub · Terms · Privacy":
        'נבנה באהבה ❤️ על ידי נועם · <a href="/">חזרה למשחקים</a> · <a href="/terms">תנאי שימוש</a> · <a href="/privacy">פרטיות</a>',
    // premium page
    "🚫 No ads anywhere on the Game Hub": "🚫 <b>בלי פרסומות</b> בכל האתר",
    "🚀 Early access: play brand-new games a week before everyone else": "🚀 <b>גישה מוקדמת</b>: משחקים חדשים שבוע לפני כולם",
    "🎨 Skins: pick your own colours in Space Shooter, Subway Runner, Dino Run and Brick Smash": "🎨 <b>סקינים</b>: בוחרים צבעים ביורה החלל, ברץ הרכבת, בריצת הדינו ובמנפץ הלבנים",
    "🖼️ Avatar frames: gold, neon, fire or rainbow around your picture": "🖼️ <b>מסגרות לתמונה</b>: זהב, ניאון, אש או קשת",
    '👑 A gold name ★ on the leaderboards and a "Premium since" badge': '👑 <b style="color:var(--gold)">שם בזהב ★</b> בטבלאות השיאים ותג "פרימיום מאז"',
    "Pay Noam ₪10 in cash. You'll get a Premium code like ABCD-1234.": "משלמים לנועם <b>10 ₪ במזומן</b> ומקבלים קוד פרימיום כמו <b>ABCD-1234</b>.",
    "🎁 Buying for someone else? A code works as a gift: give it to them and they type it in on their own account. Parents can pay for their kids the same way.":
        "🎁 <b>קונים בשביל מישהו אחר?</b> קוד הוא גם מתנה: נותנים אותו, והוא מקליד אותו בחשבון שלו. הורים יכולים לשלם בשביל הילדים באותה דרך.",
    "No code yet? Press Request Premium and Noam will switch it on after you pay.": "עדיין אין לכם קוד? לחצו על <b>בקשת פרימיום</b> ונועם יפעיל אחרי התשלום.",
    "★ Premium removes all ads and unlocks every ★ game.": "<strong>★ פרימיום</strong> מוריד את כל הפרסומות ופותח כל משחק ★.",
    // leaderboard
    "Log in and play to get on the board. Names are checked to keep the hub friendly. Gold names are Premium players.":
        'התחברו ושחקו כדי להיכנס לטבלה. השמות נבדקים כדי לשמור על אתר נעים. <span style="color:var(--gold)">שמות בזהב</span> הם שחקני פרימיום.',
    // profile
    "Frames and skins are part of Premium. Get Premium · ₪10": 'מסגרות וסקינים הם חלק מפרימיום. <a href="/premium">לקבלת פרימיום · 10 ₪</a>',
    // login
    "By continuing you agree to the Terms and Privacy Policy.": 'בהמשך אתם מסכימים ל<a href="/terms">תנאי השימוש</a> ול<a href="/privacy">מדיניות הפרטיות</a>.',
    // games
    "Best: 0 · Power-ups: ◆ double shot · ♥ extra life · ◎ shield": 'שיא: <b id="best">0</b> · שדרוגים: <span style="color:#2ee6c9">◆ ירייה כפולה</span> · <span style="color:#ff4d8d">♥ חיים נוספים</span> · <span style="color:#ffc94d">◎ מגן</span>',
    "Best: 0 · Gold bricks take two hits · catch the ★ for a wider paddle": 'שיא: <b id="best">0</b> · לבנים מזהב צריכות שתי פגיעות · תפסו את ה־★ למחבט רחב',
    "⬅ ➡ ⬆ ⬇ / WASD to fly · Space to fire On phones: drag to fly, it fires by itself. Boss every 5th wave!": "⬅ ➡ ⬆ ⬇ / WASD כדי לטוס · רווח כדי לירות<br>בטלפון: גוררים כדי לטוס, והיריות אוטומטיות.<br>בוס בכל גל חמישי!",
    "Move with the mouse, ⬅ ➡ or your finger. Click / Space to launch. Smash every brick!": "זזים עם העכבר, ⬅ ➡ או האצבע.<br>לחיצה / רווח כדי לשגר. נפצו את כל הלבנים!",
    "Space / ⬆ jump · ⬇ duck Tap to jump on phones": "רווח / ⬆ קפיצה · ⬇ התכופפות<br>בטלפון: נגיעה כדי לקפוץ",
    "⬅ ➡ switch lanes · ⬆ / Space jump Jump the barriers, dodge the trains, grab coins!": "⬅ ➡ החלפת מסלול · ⬆ / רווח קפיצה<br>קפצו מעל המחסומים, התחמקו מהרכבות ואספו מטבעות!",
    "★ Featured · Original": "★ מומלץ · מקורי"
};

// ---------- Single pieces of text ----------
const TEXT = {
    // create & explore pages
    "🕹️ Arcade World": "🕹️ עולם הארקייד",
    "🐣 My Hub pet": "🐣 חיית המחמד שלי",
    "🛠️ Level Maker": "🛠️ יוצר השלבים",
    "🧑‍💻 Game Studio": "🧑‍💻 סטודיו משחקים",
    "🎁 Made by players": "🎁 נוצר ע״י שחקנים",
    "🎧 Music & sounds": "🎧 מוזיקה וצלילים",
    "🍅 Focus timer": "🍅 טיימר ריכוז",
    "⭐ Bookmarks": "⭐ סימניות",
    "✨ Create & explore": "✨ ליצור ולגלות",
    "Arcade World": "עולם הארקייד",
    "Walk around the arcade with your pet and find the secret room": "טיילו בארקייד עם חיית המחמד ומצאו את החדר הסודי",
    "My Hub pet": "חיית המחמד שלי",
    "Hatch a pet that grows every time you play": "בקעו חיה שגדלה בכל פעם שאתם משחקים",
    "Level Maker": "יוצר השלבים",
    "Build your own Noametry levels and share them": "בנו שלבי Noametry משלכם ושתפו אותם",
    "Game Studio": "סטודיו משחקים",
    "Code your own game and publish it": "תכנתו משחק משלכם ופרסמו אותו",
    "Made by players": "נוצר ע״י שחקנים",
    "Play games and levels other players made": "שחקו במשחקים ושלבים ששחקנים אחרים יצרו",
    "Profile →": "לפרופיל ←",
    "🤚 Pat": "🤚 ליטוף",
    "📤 Share": "📤 שיתוף",
    "🍪 Food": "🍪 אוכל",
    "❤️ Love": "❤️ אהבה",
    "🎩 Accessories": "🎩 אביזרים",
    "✨ What will it become?": "✨ למה היא תתפתח?",
    "🐾 How it works": "🐾 איך זה עובד",
    "Made by Noam ·": "נבנה על ידי נועם ·",
    "About": "אודות",
    "← Player levels": "→ שלבי שחקנים",
    "Noametry →": "Noametry ←",
    "🔺 Spike": "🔺 קוץ",
    "⬛ Block": "⬛ קובייה",
    "🟡 Jump pad": "🟡 קפיצה",
    "🧽 Eraser": "🧽 מחק",
    "🗑 Clear": "🗑 ניקוי",
    "💡 Example": "💡 דוגמה",
    "▶ Test": "▶ בדיקה",
    "🚀 Publish": "🚀 פרסום",
    "🔗 Share link": "🔗 קישור לשיתוף",
    "Click or drag on the grid to place things. Scroll with the slider, the mouse wheel or ← →.": "לחצו או גררו על הלוח כדי להניח חלקים. גללו עם הסרגל, גלגלת העכבר או ← →.",
    "Name your level": "תנו שם לשלב",
    "✏️ Make one →": "✏️ צרו שלב ←",
    "🛠️ Levels made by players": "🛠️ שלבים ששחקנים יצרו",
    "Noametry levels built with the Level Maker. Beat them, like your favourites, then make your own.": "שלבי Noametry שנבנו ביוצר השלבים. עברו אותם, תנו לייק לאהובים, ואז צרו משלכם.",
    "✏️ Make a level": "✏️ צרו שלב",
    "🆕 Newest": "🆕 הכי חדשים",
    "🔥 Most played": "🔥 הכי משוחקים",
    "❤️ Most liked": "❤️ הכי אהובים",
    "👤 My levels": "👤 השלבים שלי",
    "← Made by players": "→ נוצר ע״י שחקנים",
    "Guide →": "מדריך ←",
    "➕ New": "➕ חדש",
    "Auto-run": "הרצה אוטומטית",
    "💾 Download": "💾 הורדה",
    "▶ Run": "▶ הרצה",
    "🎮 Start a new game": "🎮 התחילו משחק חדש",
    "Move the basket and catch falling stars.": "הזיזו את הסל ותפסו כוכבים נופלים.",
    "Click the cookie and buy upgrades.": "לחצו על העוגייה וקנו שדרוגים.",
    "Fly a rocket and dodge the meteors.": "הטיסו טיל והתחמקו ממטאורים.",
    "Jump over logs. Press Space or tap.": "קפצו מעל בולי עץ. רווח או נגיעה.",
    "Write your own quiz questions.": "כתבו שאלות חידון משלכם.",
    "Start from nothing.": "מתחילים מאפס.",
    "🚀 Publish to Made by Players": "🚀 פרסום ב׳נוצר ע״י שחקנים׳",
    "Game name": "שם המשחק",
    "How to play (one or two sentences)": "איך משחקים (משפט או שניים)",
    "Cover picture": "תמונת כריכה",
    "🚀 Send for review": "🚀 שליחה לבדיקה",
    "My published games": "המשחקים שפרסמתי",
    "Cancel": "ביטול",
    "🧑‍💻 Studio →": "🧑‍💻 לסטודיו ←",
    "🧑‍💻 Games made by players": "🧑‍💻 משחקים ששחקנים יצרו",
    "✏️ Make a game": "✏️ צרו משחק",
    "❤️ Like": "❤️ לייק",
    "🔀 Remix": "🔀 רמיקס",
    "← All games": "→ כל המשחקים",
    "Tell Noam": "ספרו לנועם",
    "Made by Noam and players ·": "נבנה על ידי נועם והשחקנים ·",
    "🐾 My pet →": "🐾 חיית המחמד ←",
    "🕹️ Welcome to the Arcade!": "🕹️ ברוכים הבאים לארקייד!",
    "▶ Start exploring": "▶ יוצאים לסיור",
    "Arrow keys / WASD to walk · E or Space to play · or tap anywhere to walk there": "חצים / WASD כדי ללכת · E או רווח כדי לשחק · או נגיעה במקום כלשהו כדי ללכת לשם",
    "▶ Play": "▶ שחקו",
    "🏠 Lobby": "🏠 לובי",
    "Noam's": "המשחקים", "Game Hub": "של נועם", "Noam's Game Hub": "המשחקים של נועם", "Home": "בית", "Games": "משחקים", "🏆 Leaderboards": "🏆 טבלאות שיאים",
    "Leaderboards": "טבלאות שיאים", "Articles": "כתבות", "Websites": "אתרים", "My Bio": "עליי", "📲 Install app": "📲 התקנת האפליקציה", "More ▾": "עוד ▾", "📚 Articles": "📚 כתבות", "🌐 Websites": "🌐 אתרים", "👋 About": "👋 עליי", "★ Premium": "★ פרימיום",
    "Premium": "פרימיום", "Log in": "התחברות", "Log out": "התנתקות", "👤 My profile": "👤 הפרופיל שלי", "🛠️ Admin dashboard": "🛠️ ניהול",
    "A collection of my favorite games and websites that I've created or enjoy. Pick a game, hit play, and have fun!": "אוסף של המשחקים והאתרים שבניתי ושאני אוהב. בחרו משחק, לחצו על שחק ותהנו!",
    "★ Featured · Original": "★ מומלץ · מקורי",
    "▶ Browse games": "▶ לכל המשחקים", "🎲 Surprise me": "🎲 תפתיעו אותי", "Drive over the hills, do flips, upgrade your car.": "נסעו על הגבעות, עשו סלטות ושדרגו את המכונית.", "Hop across roads, rivers and train tracks.": "קפצו מעל כבישים, נהרות ומסילות רכבת.", "Grow your snake and outsmart 15 rivals.": "גדלו את הנחש ותערימו על 15 יריבים.", "Drop fruit, merge them, make a watermelon!": "הפילו פירות, מזגו אותם והגיעו לאבטיח!", "Drag blocks, clear rows and columns.": "גררו בלוקים ונקו שורות ועמודות.", "Aim, bounce and pop 3 or more bubbles.": "כוונו, הקפיצו ופוצצו 3 בועות או יותר.", "8-ball pool vs the computer or a friend.": "ביליארד שמונה נגד המחשב או חבר.", "11-a-side matches, a knockout cup and penalties.": "משחקי 11 על 11, גביע נוקאאוט ופנדלים.", "About me": "עליי", "More websites": "עוד אתרים", "Terms": "תנאי שימוש", "Contact": "צור קשר", "Made with ❤️ by Noam ·": "נבנה באהבה ❤️ על ידי נועם ·", "🔥 New games": "🔥 משחקים חדשים", "NEW": "חדש", "Try Noametry": "לנסות את נועמטרי", "DAILY CHALLENGE": "האתגר היומי", "▶ Play": "▶ לשחק", "🕹️ Continue playing": "🕹️ להמשיך לשחק",
    "❤️ Your favorites": "❤️ המועדפים שלך", "A fun and challenging puzzle game where you solve geometric puzzles to progress through levels.": "משחק מאתגר וכיפי שבו פותרים חידות גאומטריות כדי לעבור שלבים.",
    "▶ Play Noametry": "▶ לשחק בנועמטרי", "All Games": "כל המשחקים", "All": "הכול", "Arcade": "ארקייד", "Puzzle": "חשיבה", "Runner": "ריצה", "Platformer": "פלטפורמה",
    "Sports": "ספורט", "❤️ Favorites": "❤️ מועדפים", "Original": "מקורי", "New": "חדש", "runner": "ריצה", "board": "לוח", "2p": "2 שחקנים", "relaxing": "רגוע", "music": "מוזיקה", "physics": "פיזיקה", "shooter": "יריות", "arcade": "ארקייד", "puzzle": "חשיבה", "platformer": "פלטפורמה", "sports": "ספורט", "🧠 Brain": "🧠 מוח", "brain": "מוח", "strategy": "אסטרטגיה", "word": "מילים", "creative": "יצירה",
    "🚀 Early access": "🚀 גישה מוקדמת",
    "Jump and dodge your way through geometric levels.": "קופצים ומתחמקים בשלבים גאומטריים.", "Blast alien waves, grab power-ups, beat the boss.": "יורים בגלי חייזרים, אוספים שדרוגים ומביסים את הבוס.",
    "Slide and merge the tiles to reach 2048.": "מחליקים ומחברים אריחים עד 2048.", "Smash every brick — level after level.": "מנפצים כל לבנה, שלב אחרי שלב.",
    "Flip cards and find every pair.": "הופכים קלפים ומוצאים כל זוג.", "Switch lanes, jump barriers, dodge the trains.": "מחליפים מסלולים, קופצים מעל מחסומים ומתחמקים מרכבות.",
    "Jump the cacti and duck under the birds.": "קופצים מעל קקטוסים ומתכופפים מתחת לציפורים.", "Tap to flap and fly through the gaps.": "נוגעים כדי לנפנף ועפים בין הרווחים.", "Tap to flap and help the chicken fly through the gaps.": "נוגעים כדי לנפנף ועוזרים לתרנגולת לעוף דרך הרווחים.",
    "The classic — eat and grow longer.": "הקלאסיקה: אוכלים וגדלים.", "Eat all the dots and avoid the ghosts.": "אוכלים את כל הנקודות ובורחים מהרוחות.",
    "Arrange falling blocks to clear lines.": "מסדרים בלוקים נופלים ומעלימים שורות.", "Run, jump and stomp across new levels.": "רצים, קופצים ומועכים אויבים בשלבים חדשים.",
    "Blow bubbles to trap the monsters.": "מנפחים בועות ולוכדים מפלצות.", "Play chess against the computer or a friend.": "משחקים שחמט נגד המחשב או נגד חבר.",
    "Race and dodge the traffic.": "דוהרים ומתחמקים מהתנועה.", "Score more goals than the computer in 90 seconds.": "מבקיעים יותר גולים מהמחשב ב־90 שניות.",
    "Bounce the ball past the computer. First to 7 wins.": "מקפיצים את הכדור אל מעבר למחשב. הראשון ל־7 מנצח.", "Drop discs and line up four before the computer.": "מפילים דיסקיות ומסדרים ארבע בשורה לפני המחשב.",
    "X and O against the computer or a friend.": "איקס ועיגול נגד המחשב או נגד חבר.", "Use the numbers to find every hidden mine.": "משתמשים במספרים כדי למצוא כל מוקש מוסתר.",
    "Bop the moles, skip the bombs, beat the clock.": "מכים בחפרפרות, נזהרים מהפצצות ומנצחים את השעון.", "Remember the colour pattern and play it back.": "זוכרים את סדר הצבעים ומנגנים אותו בחזרה.",
    "Drop the blocks and build the tallest tower.": "מפילים בלוקים ובונים את המגדל הגבוה ביותר.", "Fly, shoot and break the space rocks apart.": "טסים, יורים ומנפצים את סלעי החלל.",
    "Solve as many sums as you can in 60 seconds.": "פותרים כמה שיותר תרגילים ב־60 שניות.", "Type the falling words before they land.": "מקלידים את המילים הנופלות לפני שהן נוחתות.",
    "Shoot penalties, then dive to save them.": "בועטים פנדלים, ואז קופצים להציל אותם.", "Keep the football in the air as long as you can.": "שומרים על הכדור באוויר כמה שיותר זמן.",
    "Nine holes of putting, walls, water and sand.": "תשעה גומות עם קירות, מים וחול.", "Swipe to bowl, add spin and go for a strike.": "מחליקים כדי לגלגל, מוסיפים סיבוב והולכים על סטרייק.",
    "Rally against the computer and win the match.": "חילופי מכות נגד המחשב, ומנצחים במשחק.", "Smash the puck into the computer's goal.": "מטיחים את הדיסקית לשער של המחשב.",
    "Shoot as many baskets as you can in 60 seconds.": "קולעים כמה שיותר סלים ב־60 שניות.", "Swap gems to match three and set off chains.": "מחליפים יהלומים, מסדרים שלושה ויוצרים תגובות שרשרת.",
    "Bounce up from cloud to cloud into space.": "קופצים מענן לענן עד החלל.", "Swipe to slice the fruit. Never the bombs!": "מחליקים כדי לחתוך פירות. אף פעם לא פצצות!",
    "Head the crosses into the goal past the keeper.": "נוגחים את ההגבהות לשער ועוברים את השוער.", "A full football match: pass, dribble and shoot.": "משחק כדורגל מלא: מסירות, כדרורים ובעיטות.",
    "Jump and capture to beat the computer.": "קופצים ואוכלים כדי לנצח את המחשב.", "Fill the grid so every row, column and box has 1 to 9.": "ממלאים את הלוח כך שבכל שורה, עמודה וריבוע יהיו 1 עד 9.",
    "The classic card game. Build each suit from A to K.": "משחק הקלפים הקלאסי. בונים כל צורה מ־A עד K.", "Find and sink the computer's hidden fleet.": "מוצאים ומטביעים את הצי המוסתר של המחשב.",
    "Build towers and stop 20 waves of invaders.": "בונים מגדלים ועוצרים 20 גלים של פולשים.", "Find the secret 5-letter word in 6 tries.": "מוצאים את המילה הסודית בת 5 האותיות ב־6 ניסיונות.",
    "Find every hidden word in the letter grid.": "מוצאים כל מילה מוסתרת בלוח האותיות.", "Countries, flags and capitals of the world.": "מדינות, דגלים ובירות העולם.",
    "Hit the falling notes right on the beat.": "פוגעים בתווים הנופלים בדיוק בקצב.", "Bake cupcakes, hire helpers, grow your bakery.": "אופים קאפקייקס, מגייסים עוזרים ומגדילים את המאפייה.",
    "Draw pixel art and save your picture.": "מציירים ציורי פיקסלים ושומרים את הציור.", "Defend your base from waves of enemy tanks.": "מגינים על הבסיס מגלים של טנקי אויב.",
    "Cast your line and catch the rarest fish.": "זורקים חכה ותופסים את הדגים הכי נדירים.", "Find the exit of a brand new maze every time.": "מוצאים את היציאה ממבוך חדש בכל פעם.",
    "🔤 Word": "🔤 מילים", "🏰 Strategy": "🏰 אסטרטגיה", "🎨 Creative": "🎨 יצירה", "🎲 Board & Cards": "🎲 לוח וקלפים", "👥 2 Players": "👥 2 שחקנים",
    "No games match your search 😕": "לא נמצאו משחקים 😕", "About Noam's Game Hub": "על המשחקים של נועם", "💾 Save your scores": "💾 שומרים שיאים",
    "👨‍👩‍👧 Made for kids": "👨‍👩‍👧 מתאים לילדים", "Every game is safe for all ages. There's no chat, no violence and no in-game shop. Ads are set to child-safe mode.": "כל המשחקים מתאימים לכל הגילים. אין צ'אט, אין אלימות ואין חנות בתוך המשחק. הפרסומות מוגדרות למצב בטוח לילדים.",
    "Questions": "שאלות", "Is it really free?": "זה באמת בחינם?", "Yes. Almost every game is free to play without an account. Premium is optional.": "כן. כמעט כל המשחקים חינמיים גם בלי חשבון. פרימיום הוא רשות.",
    "Do the games work on phones?": "המשחקים עובדים בטלפון?", "Yes, most games have touch controls: tap, swipe or use the on-screen buttons.": "כן, ברוב המשחקים יש שליטה במגע: נגיעה, החלקה או כפתורים על המסך.",
    "Open menu": "פתיחת תפריט", "Featured game": "משחק מומלץ", "Search games…": "חיפוש משחקים…", "Search games": "חיפוש משחקים", "Filter by category": "סינון לפי סוג",
    "Favorite": "מועדף", "Add to favorites": "הוספה למועדפים", "Remove from favorites": "הסרה מהמועדפים", "About the Game Hub": "על האתר",
    // login
    "Welcome back": "טוב לראות אותך", "Log in to save your progress": "התחברו כדי לשמור את ההתקדמות", "Create account": "יצירת חשבון", "Join the Game Hub — it's free": "הצטרפו, זה בחינם",
    "Sign up": "הרשמה", "Display name": "שם תצוגה", "Email": "אימייל", "Password": "סיסמה", "Forgot password?": "שכחת סיסמה?", "or": "או", "Continue with Google": "המשך עם Google",
    "← Back to games": "→ חזרה למשחקים", "At least 6 characters": "לפחות 6 תווים",
    "Wrong email or password.": "אימייל או סיסמה שגויים.", "That email address doesn't look right.": "כתובת האימייל לא נראית תקינה.",
    "There's already an account with that email — try logging in.": "כבר יש חשבון עם האימייל הזה. נסו להתחבר.", "Password must be at least 6 characters.": "הסיסמה צריכה לפחות 6 תווים.",
    "Too many attempts. Wait a minute and try again.": "יותר מדי ניסיונות. חכו דקה ונסו שוב.", "Google sign-in was closed before finishing.": "החלון של Google נסגר לפני הסיום.",
    "Enter your email and password.": "הקלידו אימייל וסיסמה.", "Please choose a friendlier name.": "בחרו בבקשה שם נחמד יותר.",
    // profile
    "🎮 Games": "🎮 משחקים", "🛠️ Admin": "🛠️ ניהול", "Loading your profile…": "טוען את הפרופיל…", "Save": "שמירה", "Cancel": "ביטול", "Free plan": "חשבון חינמי",
    "LEVEL": "רמה", "📅 Today's challenge:": "📅 האתגר של היום:", "Finish it today for +40 XP.": "סיימו היום וקבלו 40+ XP.", "★ Get Premium · ₪10": "★ לקבלת פרימיום · 10 ₪",
    "Get Premium · ₪10": "לקבלת פרימיום · 10 ₪", "Games played": "משחקים ששיחקת", "Total plays": "סך הכול משחקים", "Most played": "הכי הרבה", "🏅 Achievements": "🏅 הישגים",
    "🎨 Style": "🎨 סטייל", "Avatar frame": "מסגרת לתמונה", "None": "בלי", "Gold": "זהב", "Neon": "ניאון", "Fire": "אש", "Rainbow": "קשת", "Game skins": "סקינים למשחקים",
    "No favorites yet. Tap the ❤️ on any game on the homepage.": "עדיין אין מועדפים. לחצו על ❤️ ליד משחק בעמוד הבית.", "My games": "המשחקים שלי",
    "Not played yet": "עוד לא שיחקת", "★ Premium only": "★ לפרימיום בלבד", "Change display name": "שינוי שם", "❤️ Favorites ": "❤️ מועדפים",
    "✅ Done! Come back tomorrow for a new one.": "✅ סיימת! מחר יש אתגר חדש.", "Name updated": "השם עודכן", "Frame saved": "המסגרת נשמרה", "★ This game needs Premium": "★ המשחק הזה דורש פרימיום",
    "First game": "משחק ראשון", "Play any game": "שחקו במשחק כלשהו", "Explorer": "חוקר", "Play 5 different games": "שחקו ב־5 משחקים שונים", "Adventurer": "הרפתקן",
    "Play 10 different games": "שחקו ב־10 משחקים שונים", "Tried them all": "ניסיתי הכול", "Play every game on the hub": "שחקו בכל המשחקים באתר", "Keen player": "שחקן נלהב",
    "Play 50 games in total": "שחקו 50 משחקים בסך הכול", "Unstoppable": "בלתי ניתן לעצירה", "Play 250 games in total": "שחקו 250 משחקים בסך הכול", "Getting good": "משתפר",
    "Reach a daily-challenge score in 3 games": "הגיעו לניקוד של אתגר יומי ב־3 משחקים", "Pro": "מקצוען", "Reach an expert score in any game": "הגיעו לניקוד של מומחה במשחק כלשהו",
    "Legend": "אגדה", "Reach expert scores in 5 games": "הגיעו לניקוד של מומחה ב־5 משחקים", "Space ace": "אלוף החלל", "Score 5,000 in Space Shooter": "5,000 נקודות ביורה החלל",
    "Brick breaker": "שובר לבנים", "Score 1,000 in Brick Smash": "1,000 נקודות במנפץ הלבנים", "Number cruncher": "מלך המספרים", "Score 10,000 in 2048": "10,000 נקודות ב־2048",
    "Sharp memory": "זיכרון חד", "Score 700 in Memory Match": "700 נקודות במשחק הזיכרון", "Daily player": "שחקן יומי", "Finish a daily challenge": "סיימו אתגר יומי",
    "On a roll": "ברצף", "Finish daily challenges 3 days in a row": "סיימו אתגר יומי 3 ימים ברצף", "Week warrior": "לוחם השבוע", "Finish daily challenges 7 days in a row": "סיימו אתגר יומי 7 ימים ברצף",
    "Supporter": "תומך", "Get Premium": "קבלו פרימיום",
    // new achievements
    "Globetrotter": "מטייל עולמי", "Play 25 different games": "שחקו ב־25 משחקים שונים", "Hub legend": "אגדת האתר", "Play 1,000 games in total": "שחקו 1,000 משחקים בסך הכול",
    "Sports fan": "אוהד ספורט", "Play 8 sports games": "שחקו ב־8 משחקי ספורט", "Puzzle lover": "חובב פאזלים", "Play 8 puzzle games": "שחקו ב־8 משחקי פאזל",
    "Word nerd": "חובב מילים", "Play every word game": "שחקו בכל משחקי המילים", "Artist": "אמן", "Make a picture in Pixel Paint": "ציירו תמונה בצייר הפיקסלים",
    "Level 5": "רמה 5", "Reach level 5": "הגיעו לרמה 5", "Level 10": "רמה 10", "Reach level 10": "הגיעו לרמה 10", "Level 20": "רמה 20", "Reach level 20": "הגיעו לרמה 20",
    "All-rounder": "שחקן רב־גוני", "Reach a daily-challenge score in 10 games": "הגיעו לניקוד של אתגר יומי ב־10 משחקים", "Superstar": "סופרסטאר",
    "Reach a daily-challenge score in 25 games": "הגיעו לניקוד של אתגר יומי ב־25 משחקים", "Grand master": "רב־אמן", "Reach expert scores in 15 games": "הגיעו לניקוד של מומחה ב־15 משחקים",
    "Regular": "קבוע", "Finish 10 daily challenges": "סיימו 10 אתגרים יומיים", "Month master": "אלוף החודש", "Finish daily challenges 30 days in a row": "סיימו אתגר יומי 30 ימים ברצף",
    "New look": "לוק חדש", "Pick an avatar on your profile": "בחרו אווטאר בפרופיל", "Collector": "אספן", "Add 5 games to your favorites": "הוסיפו 5 משחקים למועדפים",
    "Critic": "מבקר", "Rate a game": "דרגו משחק", "Top critic": "מבקר בכיר", "Rate 10 games": "דרגו 10 משחקים", "Say hello": "תגידו שלום", "Write a comment on a game": "כתבו תגובה על משחק",
    "Online!": "אונליין!", "Play an online game with a friend": "שחקו משחק אונליין עם חבר", "First online win": "ניצחון אונליין ראשון", "Win an online game": "נצחו במשחק אונליין",
    "Online champion": "אלוף האונליין", "Win 10 online games": "נצחו ב־10 משחקי אונליין", "Always online": "תמיד אונליין", "Play 25 online games": "שחקו 25 משחקי אונליין",
    "Reach an expert score in any game to earn its master badge.": "הגיעו לניקוד של מומחה במשחק כלשהו כדי לקבל את תג האלוף שלו.", "Show all game masters": "הצגת כל תגי האלופים",
    // profile + player pages
    "👁️ View my public page": "👁️ העמוד הציבורי שלי", "Keep my profile private": "הפרופיל שלי פרטי", "Pick an avatar": "בחירת אווטאר", "Avatar saved": "האווטאר נשמר",
    "Your profile is private now": "הפרופיל שלך פרטי עכשיו", "Your profile is public now": "הפרופיל שלך ציבורי עכשיו", "Photo": "תמונה",
    "Loading player…": "טוען שחקן…", "We couldn't find that player.": "לא מצאנו את השחקן הזה.", "This player keeps their profile private.": "השחקן הזה שומר את הפרופיל שלו פרטי.",
    "Achievements": "הישגים", "Online wins": "ניצחונות אונליין", "🎮 Favourite games": "🎮 משחקים אהובים", "No achievements yet.": "עדיין אין הישגים.", "No games played yet.": "עדיין לא שיחק.",
    "👤 My profile": "👤 הפרופיל שלי", "(you)": "(את/ה)", "LEVEL": "רמה",
    // homepage
    "📚 Guides & articles": "📚 מדריכים וכתבות", "All articles →": "לכל הכתבות ←", "Sort: Featured": "מיון: מומלצים", "⭐ Top rated": "⭐ הכי מדורגים", "🔥 Most popular": "🔥 הכי פופולריים", "🆕 Newest": "🆕 הכי חדשים", "🔤 A to Z": "🔤 לפי א״ב", "Sort games": "מיון משחקים", "Clear": "ניקוי",
    // premium
    "← Games": "→ משחקים", "👤 Profile": "👤 פרופיל", "Go Premium": "עוברים לפרימיום", "One payment. Yours forever.": "תשלום אחד. שלך לתמיד.", "lifetime": "לכל החיים",
    "Pay once · no subscription": "משלמים פעם אחת · בלי מנוי", "🎟️ Have a Premium code?": "🎟️ יש לכם קוד פרימיום?", "Type it in to switch on Premium straight away.": "הקלידו אותו ופרימיום יופעל מיד.",
    "Redeem": "הפעלה", "★ You already have Premium. Thanks for supporting the hub!": "★ כבר יש לך פרימיום. תודה על התמיכה!", "⏳ Request sent! Pay Noam ₪10 and he'll switch it on.": "⏳ הבקשה נשלחה! שלמו לנועם 10 ₪ והוא יפעיל.",
    "★ Request Premium": "★ בקשת פרימיום", "Log in to get Premium": "התחברו כדי לקבל פרימיום", "How it works": "איך זה עובד", "Log in (or make a free account) and type the code in the box above.": "מתחברים (או פותחים חשבון חינמי) ומקלידים את הקוד בתיבה למעלה.",
    "That's it: Premium is on, for life.": "וזהו: פרימיום מופעל, לכל החיים.", "Premium code": "קוד פרימיום", "Checking…": "בודק…", "🎉 Premium is on! Enjoy the games.": "🎉 פרימיום הופעל! תהנו מהמשחקים.",
    "That code doesn't work. Check it, or it may have been used already.": "הקוד לא עובד. בדקו אותו, אולי כבר השתמשו בו.", "Codes look like ABCD-1234.": "קודים נראים כך: ABCD-1234.",
    "You already have Premium!": "כבר יש לך פרימיום!", "Log in first.": "קודם צריך להתחבר.",
    // leaderboard
    "Leader": "טבלאות", "boards": "שיאים", "🏆 Top players": "🏆 השחקנים הכי טובים", "The best scores on Noam's Game Hub. Weekly boards reset every Monday.": "השיאים הכי גבוהים באתר. הטבלה השבועית מתאפסת בכל יום שני.",
    "This week": "השבוע", "All time": "בכל הזמנים", "Loading…": "טוען…", "▶ Play": "▶ לשחק",
    // bio / websites / 404
    "👋 About me": "👋 עליי", "Hi, I'm Noam!": "היי, אני נועם!", "Hi guys, I made this website for you all to have fun and enjoy these games.": "היי לכולם, בניתי את האתר הזה כדי שתיהנו מהמשחקים.",
    "Play the games": "לשחק במשחקים", "Arcade classics, puzzles and more": "קלאסיקות ארקייד, חידות ועוד", "See my websites": "האתרים שלי", "Other projects I've built": "פרויקטים נוספים שבניתי",
    "Back to the Game Hub": "חזרה למשחקים", "My Websites": "האתרים שלי", "Other projects I've built. Click one to open it.": "פרויקטים נוספים שבניתי. לחצו כדי לפתוח.",
    "Robotics · FLL": "רובוטיקה · FLL", "The website I made with my robotics team, Wings of Eagles, for FLL 2026 \"Unearthed\".": "האתר שבניתי עם קבוצת הרובוטיקה שלי, Wings of Eagles, לתחרות FLL 2026 \"Unearthed\".",
    "Open Archpal ↗": "לפתוח את Archpal ↗", "Learning · Talmud": "לימוד · גמרא", "Gemara Translator": "מתרגם הגמרא",
    "Analyze, explain and translate any passage of the Talmud, with English and Hebrew explanations, context, structure and keyword breakdowns.": "ניתוח, הסבר ותרגום של כל קטע בגמרא, עם הסברים באנגלית ובעברית, הקשר, מבנה ופירוק מילות מפתח.",
    "Open Gemara Translator →": "← לפתוח את מתרגם הגמרא", "Page not found": "הדף לא נמצא", "This page doesn't exist or has been moved.": "הדף הזה לא קיים או שהועבר.", "Go home": "לעמוד הבית",
    // games
    "Score": "ניקוד", "Best": "שיא", "Lives": "חיים", "Wave": "גל", "Level": "שלב", "Moves": "מהלכים", "Seconds": "שניות", "Easy": "קל", "Normal": "רגיל", "Hard": "קשה",
    "▶ Launch": "▶ להמריא", "Ship destroyed": "החללית הושמדה", "↻ Fly again": "↻ לטוס שוב", "No moves!": "אין מהלכים!", "↻ New game": "↻ משחק חדש", "↶ Undo": "↶ ביטול", "New game": "משחק חדש",
    "Keep playing": "להמשיך לשחק", "2048! 🎉": "2048! 🎉", "Arrow keys or swipe to slide the tiles. Merge equal numbers to reach 2048!": "חצים או החלקה כדי להזיז את האריחים. חברו מספרים שווים כדי להגיע ל־2048!",
    "All matched! 🎉": "כל הזוגות נמצאו! 🎉", "↻ Play again": "↻ לשחק שוב", "Flip two cards at a time. Fewer moves and less time = more points.": "הופכים שני קלפים בכל פעם. פחות מהלכים ופחות זמן = יותר נקודות.",
    "Game Over": "המשחק נגמר", "▶ Start": "▶ להתחיל", "↻ Again": "↻ שוב", "The desert speeds up the longer you survive": "המדבר מאיץ ככל ששורדים יותר", "▶ Run": "▶ לרוץ", "Busted!": "נתפסת!",
    "↻ Run again": "↻ לרוץ שוב", "Swipe on the game to move on phones": "בטלפון: מחליקים על המשחק כדי לזוז", "Click or press Space to launch": "לחצו או הקישו רווח כדי לשגר",
    "Score:": "ניקוד:", "High Score:": "שיא:", "Start Game": "התחלה", "Pause": "השהיה", "Resume": "המשך", "Restart": "מחדש", "Start": "התחלה", "Use Arrow Keys to control the snake": "החצים מזיזים את הנחש",
    "Back to games": "חזרה למשחקים", "★ Get Premium · ₪10 ": "★ לקבלת פרימיום · 10 ₪",
    "Your account is on the free plan. Premium unlocks every ★ game and removes all ads.": "החשבון שלך חינמי. פרימיום פותח כל משחק ★ ומוריד את כל הפרסומות.",
    "Premium is ₪10, once, for life. Already have it? Log in.": "פרימיום עולה 10 ₪, פעם אחת, לכל החיים. כבר יש לכם? התחברו.",
    // game info sections
    "How to play": "איך משחקים", "Tips": "טיפים", "More games": "עוד משחקים", "All games →": "← כל המשחקים", "🏆 Top 5 this week": "🏆 5 המובילים השבוע",
    "See the full leaderboard →": "← לטבלת השיאים המלאה", "No scores yet this week. Be the first!": "עדיין אין שיאים השבוע. היו הראשונים!", "📅 Today's daily challenge": "📅 האתגר היומי של היום",
    "✅ You finished today's challenge. Come back tomorrow for a new one!": "✅ סיימת את האתגר של היום. מחר יש אתגר חדש!", "Advertisement": "פרסומת", "★ Remove ads · ₪10 for life": "★ להסרת פרסומות · 10 ₪ לכל החיים",
    "📅 Daily challenge complete! +40 XP": "📅 האתגר היומי הושלם! 40+ XP",
    "Unlock every Premium game": "פותח את כל משחקי הפרימיום",
    // older games
    "Snake Game": "נחש", "Lines": "שורות", "Next": "הבא", "Controls:": "שליטה:", "← → Move": "← → תזוזה", "↓ Drop": "↓ הפלה", "Space Rotate ↻": "רווח סיבוב ↻",
    "Z Rotate ↺": "Z סיבוב ↺", "Lives:": "חיים:", "Level:": "שלב:", "Use Arrow Keys to move the muncher": "החצים מזיזים את הזולל", "Game Over!": "המשחק נגמר!",
    "Final Score:": "ניקוד סופי:", "Play Again": "לשחק שוב", "Click or Press Space to start": "לחצו או הקישו רווח כדי להתחיל", "Current Turn:": "תור:", "White": "לבן",
    "Black": "שחור", "Status:": "מצב:", "Game In Progress": "המשחק בעיצומו", "New Game": "משחק חדש", "Undo Last Move": "ביטול המהלך האחרון", "Move History": "היסטוריית מהלכים",
    "Check!": "שח!", "Stalemate! Draw!": "פט! תיקו!", "Motorcycle Racing": "מרוץ אופנועים", "Speed:": "מהירות:", "Arrow Keys to Steer": "החצים להיגוי", "Space to Accelerate": "רווח להאצה",
    "⚽ Soccer Game": "⚽ כדורגל", "Arrow Keys to Move | Space to Kick": "החצים לתזוזה | רווח לבעיטה", "🫧 Bubble Blaster": "🫧 מפוצץ הבועות",
    "Arrow Keys to Move & Jump | A to Shoot Bubbles": "החצים לתזוזה וקפיצה | A לירי בועות", "Noametry Dash": "נועמטרי", "Click or press SPACE to jump": "לחצו או הקישו רווח כדי לקפוץ",
    "JUMPER": "קופץ", "COINS": "מטבעות", "LIVES": "חיים", "WORLD": "עולם", "GAME OVER": "המשחק נגמר", "COURSE CLEAR!": "עברתם את השלב!", "PAUSED": "מושהה",
    "Use Arrow Keys to control the snake ": "החצים מזיזים את הנחש",
    // page titles split in two colours
    "Leaderboards": "טבלאות שיאים", "Game Hub Premium": "פרימיום", "Game Hub Articles": "כתבות", "Privacy Policy": "מדיניות פרטיות", "Terms & Conditions": "תנאי שימוש",
    "Privacy →": "← פרטיות", "Terms →": "← תנאי שימוש", "All articles": "כל הכתבות",
    // articles index
    "📚 Articles": "📚 כתבות", "Tips for our games, how games work, and how to start making your own.": "טיפים למשחקים, איך משחקים עובדים ואיך מתחילים לבנות משחק משלכם."
};

// ---------- Game info sections (about / controls / tips) ----------

// ---- Mac app page (/app) ----
Object.assign(BLOCKS, {
 "Game Hub for Mac": "המשחקים של נועם <span>למק</span>",
 "Noam's Game Hub for Mac": "המשחקים של נועם – אפליקציה למק",
 "All the games in their own app, with a Dock icon. No browser tabs, no searching for the website. Open it and play.": "כל המשחקים באפליקציה משלהם, עם אייקון ב־Dock. בלי לשוניות בדפדפן ובלי לחפש את האתר. פותחים ומשחקים.",
 "What you get": "מה מקבלים",
 "Download": "הורדה",
 "How to install": "איך מתקינים",
 "No download? Use Safari": "בלי הורדה? דרך Safari",
 "Questions": "שאלות",
 "Not sure which one? Click the Apple menu → About This Mac. If it says Chip: Apple M…, get the first one. If it says Processor: Intel, get the second one.": "לא בטוחים איזה? לחצו על <b>תפריט Apple ← אודות המק הזה</b> (About This Mac). אם כתוב <b>Chip: Apple M…</b>, הורידו את הראשון. אם כתוב <b>Processor: Intel</b>, הורידו את השני.",
 "Open the file you downloaded.": "פתחו את הקובץ שהורדתם.",
 "Drag Noam's Game Hub onto the Applications folder.": "גררו את <b>Noam's Game Hub</b> לתיקייה <b>Applications</b> (יישומים).",
 "Open Terminal (press Command-Space and type Terminal).": "פתחו את Terminal (לחצו Command-רווח והקלידו <b>Terminal</b>).",
 "Paste xattr -cr \"/Applications/Noam's Game Hub.app\" and press Enter.": "הדביקו <code>xattr -cr \"/Applications/Noam's Game Hub.app\"</code> ולחצו Enter.",
 "Open the Game Hub from Applications or Launchpad. You only do this once.": "פתחו את האפליקציה מ־Applications או מ־Launchpad. עושים את זה רק פעם אחת.",
 "Open the app. When the Mac says it can't check it, click Done.": "פתחו את האפליקציה. כשהמק אומר שהוא לא יכול לבדוק אותה, לחצו <b>סיום</b> (Done).",
 "Go to System Settings → Privacy & Security, scroll down and click Open Anyway.": "היכנסו ל<b>הגדרות המערכת ← פרטיות ואבטחה</b>, גללו למטה ולחצו <b>פתח בכל זאת</b> (Open Anyway).",
 "The Mac shows this warning for any app that hasn't paid Apple for a signing certificate. It doesn't mean something is wrong.": "המק מציג את האזהרה הזאת לכל אפליקציה שלא שילמה לאפל על תעודת חתימה. זה לא אומר שמשהו לא בסדר.",
 "On macOS Sonoma or newer, open noamtoder.com in Safari, then click File → Add to Dock. You get a Game Hub icon in your Dock with no download at all.": "ב־macOS Sonoma ומעלה, פתחו את <a class=\"inl\" href=\"/\">noamtoder.com</a> ב־Safari ולחצו <b>קובץ ← הוסף ל־Dock</b> (File → Add to Dock). מקבלים אייקון של המשחקים ב־Dock בלי להוריד כלום.",
 "Is the app free?": "האפליקציה בחינם?",
 "Yes. The app is free, and so are the games. Premium works in the app the same as on the website.": "כן. האפליקציה בחינם, וגם המשחקים. פרימיום עובד באפליקציה בדיוק כמו באתר.",
 "Do I need the internet?": "צריך אינטרנט?",
 "Yes. The app loads the games from noamtoder.com, so new games show up right away.": "כן. האפליקציה טוענת את המשחקים מ־noamtoder.com, ולכן משחקים חדשים מופיעים מיד.",
 "Is there a Windows or iPhone app?": "יש אפליקציה לווינדוס או לאייפון?",
 "Not yet. On an iPhone or iPad, open the site in Safari, tap Share, then Add to Home Screen.": "עדיין לא. באייפון או באייפד, פתחו את האתר ב־Safari, לחצו על שיתוף ואז <b>הוסף למסך הבית</b>.",
 "Who makes it?": "מי עשה את זה?",
 "Noam, who makes all the games on Noam's Game Hub. Questions or ideas: noam@noamtoder.com.": "נועם, שעושה את כל המשחקים ב<a class=\"inl\" href=\"/\">המשחקים של נועם</a>. שאלות או רעיונות: <a class=\"inl\" href=\"mailto:noam@noamtoder.com\">noam@noamtoder.com</a>."
});
Object.assign(TEXT, {
 "🍎 Mac app": "🍎 אפליקציה למק",
 "Mac app": "אפליקציה למק",
 "Download": "הורדה",
 "Is the app free?": "האפליקציה בחינם?",
 "Do I need the internet?": "צריך אינטרנט?",
 "Is there a Windows or iPhone app?": "יש אפליקציה לווינדוס או לאייפון?",
 "Who makes it?": "מי עשה את זה?",
 "← Game Hub": "→ המשחקים",
 "✅ You're already using the Mac app. Updates show up by themselves.": "✅ אתם כבר באפליקציה למק. עדכונים מגיעים לבד.",
 "⬇ Download for Mac": "⬇ הורדה למק",
 "Free · Apple chip (M1, M2, M3, M4…)": "בחינם · שבב Apple ‏(M1, M2, M3, M4…)",
 "Free · Intel Mac": "בחינם · מק עם Intel",
 "Older Intel Mac? Get this one →": "מק ישן עם Intel? הורידו את זה ←",
 "Mac with Apple chip? Get this one →": "מק עם שבב Apple? הורידו את זה ←",
 "Always the newest version": "תמיד הגרסה הכי חדשה",
 "🎮 Every game": "🎮 כל המשחקים",
 "All the games, Arcade World, the Level Maker, the Game Studio and your Hub pet, the same as on the website.": "כל המשחקים, עולם הארקייד, יוצר השלבים, סטודיו המשחקים וחיית המחמד שלכם, בדיוק כמו באתר.",
 "🚀 Opens in one click": "🚀 נפתח בלחיצה אחת",
 "The Game Hub sits in your Dock and Launchpad like any other app.": "המשחקים יושבים ב־Dock וב־Launchpad כמו כל אפליקציה אחרת.",
 "🏆 Your account": "🏆 החשבון שלכם",
 "Sign in once and stay signed in. Your scores, trophies and pet are the same everywhere.": "מתחברים פעם אחת ונשארים מחוברים. הניקוד, הגביעים וחיית המחמד זהים בכל מקום.",
 "🖥️ Full screen": "🖥️ מסך מלא",
 "Press Control-Command-F to play full screen with nothing in the way.": "לחצו Control-Command-F כדי לשחק במסך מלא בלי שום הפרעה.",
 "✨ Always up to date": "✨ תמיד מעודכן",
 "New games show up in the app the moment they're on the website.": "משחקים חדשים מופיעים באפליקציה ברגע שהם עולים לאתר.",
 "🪶 No extras": "🪶 בלי תוספות",
 "No tracking added by the app. Links to other websites open in your normal browser.": "האפליקציה לא מוסיפה שום מעקב. קישורים לאתרים אחרים נפתחים בדפדפן הרגיל.",
 "🍎 Mac with Apple chip (M1, M2, M3, M4…)": "🍎 מק עם שבב Apple ‏(M1, M2, M3, M4…)",
 "🍎 Mac with Intel chip": "🍎 מק עם שבב Intel",
 "1. Put it in Applications": "1. העבירו ל־Applications",
 "2. Open it the first time": "2. פתיחה בפעם הראשונה",
 "Or without Terminal": "או בלי Terminal",
 "Privacy": "פרטיות"
});
// ---- ng names ----
/*ng:dropmerge*/Object.assign(TEXT, {"Drop Merge": "הפל ומזג", "Drop number blocks. Matching numbers merge and double. Chain them!": "הפילו קוביות מספרים. מספרים זהים מתמזגים ומוכפלים. שרשרו אותם!"});
/*ng:colorlines*/Object.assign(TEXT, {"Color Lines": "קווי צבע", "Move balls to make lines of five. Three new balls arrive every turn!": "הזיזו כדורים כדי ליצור שורות של חמישה. שלושה כדורים חדשים בכל תור!"});
/*ng:sumopush*/Object.assign(TEXT, {"Sumo Push": "דחיפת סומו", "Shove your rival out of the ring. Best of five wins!": "דחפו את היריב מחוץ לזירה. הטוב מחמישה מנצח!"});
/*ng:timberchop*/Object.assign(TEXT, {"Timber Chop": "חוטב העצים", "Chop the tree as fast as you can, but dodge the falling branches!": "חטבו את העץ הכי מהר שאפשר, אבל התחמקו מהענפים!"});
/*ng:codebreaker*/Object.assign(TEXT, {"Code Breaker": "פורץ הקודים", "Crack the secret colour code using clever clues. A classic logic puzzle.": "פצחו את קוד הצבעים הסודי בעזרת רמזים. פאזל היגיון קלאסי."});
/*ng:fruitcatcher*/Object.assign(TEXT, {"Fruit Catcher": "תופס הפירות", "Catch the falling fruit in your basket. Dodge the bombs and old boots!": "תפסו את הפירות הנופלים בסל. התחמקו מפצצות ומנעליים ישנות!"});
/*ng:carsoccer*/Object.assign(TEXT, {"Car Soccer": "כדורגל מכוניות", "Drive, boost and bump a giant ball into the goal. 2-minute matches!": "נהגו, האיצו ודחפו כדור ענק לשער. משחקים של 2 דקות!"});
/*ng:ultimatetictactoe*/Object.assign(TEXT, {"Ultimate Tic-Tac-Toe": "איקס עיגול אולטימטיבי", "Tic-tac-toe made of nine tic-tac-toes. Every move sends your rival somewhere!": "איקס עיגול שעשוי מתשעה איקס עיגול. כל מהלך שולח את היריב למקום אחר!"});
/*ng:goldminer*/Object.assign(TEXT, {"Gold Miner": "כורה הזהב", "Swing the claw, grab gold and gems, and hit each level's money target.": "הניפו את הטופר, תפסו זהב ויהלומים, והגיעו ליעד הכסף בכל שלב."});
/*ng:watersort*/Object.assign(TEXT, {"Water Sort": "מיון מים", "Pour coloured water between tubes until every tube is one colour.": "מזגו מים צבעוניים בין מבחנות עד שבכל מבחנה צבע אחד."});
/*ng:dodge*/Object.assign(TEXT, {"Dodge!": "התחמקות!", "Dodge balls, lasers and homing stars. How long can you survive?": "התחמקו מכדורים, לייזרים וכוכבים רודפים. כמה זמן תשרדו?"});
/*ng:slimevolley*/Object.assign(TEXT, {"Slime Volley": "כדורעף סליים", "Bounce the ball over the net with your slime. First to 7 wins!": "הקפיצו את הכדור מעל הרשת עם הסליים שלכם. הראשון ל-7 מנצח!"});
/*ng:ninemensmorris*/Object.assign(TEXT, {"Nine Men's Morris": "טחנה", "An ancient strategy game: line up three to capture your rival's pieces.": "משחק אסטרטגיה עתיק: יישרו שלושה כדי לתפוס כלים של היריב."});
/*ng:spotthedifference*/Object.assign(TEXT, {"Spot the Difference": "מצאו את ההבדלים", "Two pictures, five differences. Can you find them all in time?": "שתי תמונות, חמישה הבדלים. תמצאו את כולם בזמן?"});
/*ng:turbokart*/Object.assign(TEXT, {"Turbo Kart": "טורבו קארט", "Race three computer karts for 3 laps. Hit the boost arrows!": "התחרו בשלוש מכוניות מחשב במשך 3 הקפות. עלו על חצי הטורבו!"});
/*ng:jigsaw*/Object.assign(TEXT, {"Jigsaw": "פאזל", "Drag real jigsaw pieces into place. A new painted picture every time!": "גררו חלקי פאזל אמיתיים למקומם. תמונה מצוירת חדשה בכל פעם!"});
/*ng:castlesmash*/Object.assign(TEXT, {"Castle Smash": "ניפוץ טירות", "Fling stones with a slingshot and topple the goblins' castles.": "העיפו אבנים עם קלע והפילו את הטירות של הגובלינים."});
/*ng:bombmaze*/Object.assign(TEXT, {"Bomb Maze": "מבוך הפצצות", "Drop bombs, blast through crates and knock out every robot.": "הטילו פצצות, פוצצו ארגזים והעיפו את כל הרובוטים."});
/*ng:boxpusher*/Object.assign(TEXT, {"Box Pusher": "דוחף הארגזים", "Push every crate onto a gold target. Think before you push!": "דחפו כל ארגז לעיגול זהב. חשבו לפני שאתם דוחפים!"});
/*ng:ludo*/Object.assign(TEXT, {"Ludo": "לודו", "Race your four tokens around the board and home. Capture your rivals!": "הובילו את ארבעת הכלים מסביב ללוח והביתה. תפסו את היריבים!"});
/*ng:pinball*/Object.assign(TEXT, {"Pinball": "פינבול", "Flip, bump and light up the table. Keep the ball alive!": "הפעילו את הפליפרים, פגעו במגנים והדליקו את הלוח. שמרו על הכדור!"});
/*ng:neonslope*/Object.assign(TEXT, {"Neon Slope": "מדרון ניאון", "Roll down an endless glowing track. Dodge the blocks and jump the gaps!": "התגלגלו במסלול זוהר אינסופי. התחמקו מקוביות וקפצו מעל בורות!"});
/*ng:parkingpro*/Object.assign(TEXT, {"Parking Pro": "חנייה מקצועית", "Steer carefully and park in the glowing spot without a scratch.": "נווטו בזהירות וחנו במקום הזוהר בלי שריטה."});
/*ng:blackhole*/Object.assign(TEXT, {"Black Hole": "חור שחור", "Be a hole in the ground. Swallow flowers, cars, houses… the whole city!": "היו חור באדמה. בלעו פרחים, מכוניות, בתים… את כל העיר!"});
/*ng:sandbox*/Object.assign(TEXT, {"Sand Box": "ארגז חול", "Pour sand, water, lava and fire and watch them mix and react.": "שפכו חול, מים, לבה ואש וצפו איך הם מתערבבים ומגיבים."});
/*ng:targetrush*/Object.assign(TEXT, {"Target Rush": "מטרות מהירות", "Click the targets before they vanish. How sharp is your aim?": "לחצו על המטרות לפני שהן נעלמות. כמה הכיוון שלכם חד?"});
/*ng:beatmaker*/Object.assign(TEXT, {"Beat Maker": "יוצר הביטים", "Make your own beats with drums, bass and melody. Share them with a link!": "צרו ביטים משלכם עם תופים, בס ומנגינה. שתפו אותם בקישור!"});
/*ng:colorhop*/Object.assign(TEXT, {"Color Hop": "קפיצת צבעים", "Hop through the spinning shapes, but only through your own colour!": "קפצו דרך הצורות המסתובבות, אבל רק דרך הצבע שלכם!"});
/*ng:zombiesurvival*/Object.assign(TEXT, {"Zombie Survival": "הישרדות זומבים", "Hold off wave after wave of cartoon zombies. How long can you last?": "עצרו גל אחרי גל של זומבים מצוירים. כמה זמן תחזיקו?"});
/*ng:burgerchef*/Object.assign(TEXT, {"Burger Chef": "שף המבורגרים", "Stack each burger exactly the way the customer ordered it. Fast!": "בנו כל המבורגר בדיוק כמו שהלקוח הזמין. מהר!"});
/*ng:crazyeights*/Object.assign(TEXT, {"Crazy Eights": "שמיניות משוגעות", "Match the suit or number, play wild 8s and empty your hand first.": "התאימו צורה או מספר, שחקו 8 ג'וקר וסיימו את הקלפים ראשונים."});
/*ng:paintterritory*/Object.assign(TEXT, {"Paint Territory": "צביעת שטח", "Draw loops to claim land. Cut other players' trails, but protect your own!": "ציירו לולאות כדי לכבוש שטח. חתכו שובלים של אחרים, אבל שמרו על שלכם!"});
/*ng:celleater*/Object.assign(TEXT, {"Cell Eater": "אוכל התאים", "Eat dots and smaller cells to grow. Run from the big ones!": "אכלו נקודות ותאים קטנים כדי לגדול. ברחו מהגדולים!"});
/*ng:fireworks*/Object.assign(TEXT, {"Fireworks": "זיקוקים", "A relaxing fireworks toy. Tap the sky to light it up!": "צעצוע זיקוקים מרגיע. הקישו על השמיים כדי להאיר אותם!"});
/*ng:dicefive*/Object.assign(TEXT, {"Dice Five": "חמש קוביות", "Roll five dice, keep the best and fill every box on the score card.": "הטילו חמש קוביות, שמרו את הטובות ומלאו כל תא בכרטיס."});
/*ng:skislope*/Object.assign(TEXT, {"Ski Slope": "מדרון סקי", "Ski down the mountain through the flags. Watch out for the yeti!": "גלשו במורד ההר בין הדגלים. זהירות מהיטי!"});
/*ng:balloonpop*/Object.assign(TEXT, {"Balloon Pop": "פיצוץ בלונים", "Pop as many balloons as you can in 60 seconds. Don't pop the bombs!": "פוצצו כמה שיותר בלונים ב-60 שניות. אל תפוצצו את הפצצות!"});
/*ng:snakesladders*/Object.assign(TEXT, {"Snakes & Ladders": "סולמות ונחשים", "Roll the die, climb the ladders, dodge the snakes. First to 100 wins!": "הטילו קובייה, טפסו בסולמות והתחמקו מנחשים. הראשון ל-100 מנצח!"});
/*ng:archery*/Object.assign(TEXT, {"Archery": "קשתות", "Pull back your bow, mind the wind and hit the bullseye.": "מתחו את הקשת, שימו לב לרוח ופגעו במרכז."});
/*ng:jetpackdash*/Object.assign(TEXT, {"Jetpack Dash": "דהירת ג'טפאק", "Hold to fly with your jetpack. Dodge zappers and missiles!": "החזיקו כדי לעוף עם הג'טפאק. התחמקו ממזפים ומטילים!"});
/*ng:brickballs*/Object.assign(TEXT, {"Brick Balls": "כדורים ולבנים", "Aim, shoot a stream of balls, and break the numbered bricks.": "כוונו, ירו זרם של כדורים ושברו את הלבנים הממוספרות."});
/*ng:memorygrid*/Object.assign(TEXT, {"Memory Grid": "רשת הזיכרון", "Some squares light up. Remember them and tap them all!": "כמה ריבועים נדלקים. זכרו אותם והקישו על כולם!"});
/*ng:higherlower*/Object.assign(TEXT, {"Higher or Lower": "גבוה או נמוך", "Will the next card be higher or lower? Build a winning streak!": "האם הקלף הבא יהיה גבוה או נמוך? בנו רצף ניצחונות!"});
/*ng:reactiontest*/Object.assign(TEXT, {"Reaction Test": "מבחן תגובה", "How fast are you? Tap the moment the screen turns green.": "כמה אתם מהירים? הקישו ברגע שהמסך נהיה ירוק."});
/*ng:colortrick*/Object.assign(TEXT, {"Color Trick": "טריק הצבעים", "Does the word match the colour? Your brain will try to trick you!": "האם המילה מתאימה לצבע? המוח שלכם ינסה לעבוד עליכם!"});
/*ng:plinko*/Object.assign(TEXT, {"Plinko": "פלינקו", "Drop balls through the pegs and hope for the 100 slot.": "הפילו כדורים דרך היתדות וקוו לתא ה-100."});
/*ng:darts*/Object.assign(TEXT, {"Darts": "חצים", "Play 301: count down to zero and finish on a double.": "שחקו 301: ספרו לאחור לאפס וסיימו על דאבל."});
/*ng:moonlander*/Object.assign(TEXT, {"Moon Lander": "נחיתה על הירח", "Fire your engine carefully and land softly on the Moon.": "הפעילו את המנוע בזהירות ונחתו בעדינות על הירח."});
/*ng:lightbikes*/Object.assign(TEXT, {"Light Bikes": "אופנועי אור", "Ride a glowing bike and trap the others with your trail.": "רכבו על אופנוע זוהר ולכדו את האחרים עם השובל שלכם."});
/*ng:alieninvaders*/Object.assign(TEXT, {"Alien Invaders": "פולשים מהחלל", "Blast the marching alien army before it lands.": "פוצצו את צבא החייזרים הצועד לפני שהוא נוחת."});
/*ng:citydefender*/Object.assign(TEXT, {"City Defender": "מגן העיר", "Tap the sky to stop falling rockets and save your cities.": "הקישו על השמיים כדי לעצור טילים נופלים ולהציל את הערים."});
/*ng:stickbridge*/Object.assign(TEXT, {"Stick Bridge": "גשר המקל", "Grow a stick just long enough to cross the gap.": "הגדילו מקל בדיוק באורך הנכון כדי לחצות את הפער."});
/*ng:pianotiles*/Object.assign(TEXT, {"Piano Tiles": "אריחי פסנתר", "Tap the black tiles to play a song. Never tap white!": "הקישו על האריחים השחורים כדי לנגן שיר. אף פעם לא על לבן!"});
/*ng:knifethrow*/Object.assign(TEXT, {"Knife Throw": "זריקת סכינים", "Stick every knife in the spinning log.": "נעצו כל סכין בבול העץ המסתובב."});
/*ng:helixdrop*/Object.assign(TEXT, {"Helix Drop": "נפילת ספירלה", "Spin the tower and drop the ball through the gaps.": "סובבו את המגדל והפילו את הכדור דרך הפתחים."});
/*ng:tilematch*/Object.assign(TEXT, {"Tile Match": "התאמת אריחים", "Tap tiles into the tray. Three of a kind disappear!": "הקישו על אריחים למגש. שלושה זהים נעלמים!"});
/*ng:picturecross*/Object.assign(TEXT, {"Picture Cross": "תמונה נסתרת", "Use the number clues to paint a hidden picture.": "השתמשו ברמזי המספרים כדי לצבוע תמונה נסתרת."});
/*ng:trafficjam*/Object.assign(TEXT, {"Traffic Jam": "פקק תנועה", "Slide the cars out of the way to free the red car.": "הזיזו את המכוניות כדי לשחרר את המכונית האדומה."});
/*ng:pipeconnect*/Object.assign(TEXT, {"Pipe Connect": "חיבור צינורות", "Turn the pipes so water reaches every tile.": "סובבו את הצינורות כך שהמים יגיעו לכל משבצת."});
/*ng:wordscramble*/Object.assign(TEXT, {"Word Scramble": "ערבוב מילים", "Unscramble as many words as you can in 90 seconds.": "סדרו כמה שיותר מילים מבולבלות ב־90 שניות."});
/*ng:hangman*/Object.assign(TEXT, {"Balloon Hangman": "תלוי בבלונים", "Guess the word before all the balloons pop.": "נחשו את המילה לפני שכל הבלונים מתפוצצים."});
/*ng:slidepuzzle*/Object.assign(TEXT, {"Slide Puzzle": "פאזל הזזה", "Slide the numbered tiles back into order.": "הזיזו את האריחים הממוספרים בחזרה למקום."});
/*ng:hanoi*/Object.assign(TEXT, {"Tower of Hanoi": "מגדלי האנוי", "Move the tower one disc at a time.": "העבירו את המגדל דיסקית אחת בכל פעם."});
/*ng:mancala*/Object.assign(TEXT, {"Mancala": "מנקלה", "Sow stones, capture, and fill your store.": "פזרו אבנים, לכדו ומלאו את המחסן שלכם."});
/*ng:lightsout*/Object.assign(TEXT, {"Lights Out": "כיבוי אורות", "Tap a light to flip it and its neighbors. Turn them all off!": "הקישו על אור כדי להחליף אותו ואת שכניו. כבו את כולם!"});
/*ng:fiveinarow*/Object.assign(TEXT, {"Five in a Row": "חמש ברצף", "Line up five stones before the computer does.": "סדרו חמש אבנים בשורה לפני המחשב."});
/*ng:dotsboxes*/Object.assign(TEXT, {"Dots and Boxes": "נקודות וריבועים", "Draw lines, close boxes and outsmart the computer.": "ציירו קווים, סגרו ריבועים ותערימו על המחשב."});
/*ng:reversi*/Object.assign(TEXT, {"Reversi": "רברסי", "Flip your opponent's discs and own the board.": "הפכו את הדסקיות של היריב ושלטו בלוח."});
/*ng:ballsort*/Object.assign(TEXT, {"Ball Sort": "מיון כדורים", "Sort the colored balls into matching tubes.": "מיינו את הכדורים הצבעוניים למבחנות תואמות."});
const INFO = {
    "Noametry is the original game of the hub. Your square slides along a never-ending track full of spikes and blocks, and one well-timed jump is the difference between a new record and starting over. The track speeds up as your score climbs, so every run feels a little more intense than the last.":
        "נועמטרי הוא המשחק המקורי של האתר. הריבוע שלכם מחליק על מסלול אינסופי מלא קוצים ובלוקים, וקפיצה אחת בזמן הנכון היא ההבדל בין שיא חדש להתחלה מחדש. המסלול מאיץ ככל שהניקוד עולה, כך שכל ריצה מרגישה קצת יותר מותחת מהקודמת.",
    "Defend the galaxy against waves of pixel aliens. Each wave brings more enemies, and some of them break formation and dive straight at your ship. Every fifth wave a giant mothership appears with a health bar and a spread of laser fire. Shoot it down for a big bonus.":
        "הגנו על הגלקסיה מפני גלים של חייזרי פיקסלים. כל גל מביא יותר אויבים, וחלקם יוצאים מהשורה וצוללים ישר אל החללית שלכם. בכל גל חמישי מופיעה חללית אם ענקית עם פס חיים ומטר לייזרים. הפילו אותה ותקבלו בונוס גדול.",
    "2048 is a sliding number puzzle. Every move pushes all the tiles in one direction, and two tiles with the same number join into one with double the value. A new tile appears after every move. Reach the 2048 tile to win, then keep going for a higher score.":
        "2048 הוא חידת מספרים מחליקה. כל מהלך דוחף את כל האריחים לכיוון אחד, ושני אריחים עם אותו מספר מתחברים לאריח אחד עם ערך כפול. אחרי כל מהלך מופיע אריח חדש. הגיעו לאריח 2048 כדי לנצח, ואז המשיכו לניקוד גבוה יותר.",
    "Bounce the ball off your paddle and break every brick on the screen. Where the ball hits the paddle decides its angle, so you can aim. Gold bricks need two hits, and a falling star makes your paddle extra wide for a while. Clear the wall to move to a harder level with a faster ball.":
        "הקפיצו את הכדור עם המחבט ושברו כל לבנה על המסך. המקום שבו הכדור פוגע במחבט קובע את הזווית, כך שאפשר לכוון. לבנים מזהב צריכות שתי פגיעות, וכוכב נופל מרחיב את המחבט לזמן מה. נקו את הקיר כדי לעבור לשלב קשה יותר עם כדור מהיר יותר.",
    "A classic memory card game. All the cards start face down, and you flip two at a time. If they match, they stay open; if not, they flip back and you have to remember where they were. Choose Easy, Normal or Hard. Your score is higher when you use fewer moves and less time.":
        "משחק זיכרון קלאסי. כל הקלפים מתחילים הפוכים, והופכים שניים בכל פעם. אם הם זהים הם נשארים פתוחים, ואם לא הם מתהפכים בחזרה וצריך לזכור איפה הם היו. בחרו קל, רגיל או קשה. ככל שמשתמשים בפחות מהלכים ופחות זמן, הניקוד גבוה יותר.",
    "Run down a three-lane railway as fast as you can. Trains come straight at you, so switch lanes to get out of the way, and jump over the red and white barriers. Grab coins for extra points. The longer you survive, the faster the trains come.":
        "רוצו לאורך מסילה עם שלושה מסלולים הכי מהר שאפשר. רכבות מגיעות ישר אליכם, אז החליפו מסלול כדי לזוז מהדרך, וקפצו מעל המחסומים האדומים־לבנים. אספו מטבעות לנקודות נוספות. ככל ששורדים יותר, הרכבות מגיעות מהר יותר.",
    "A little dinosaur runs across the desert at night and day. Jump over cacti and duck under flying birds. The desert speeds up the longer you survive, and the sky switches between day and night as your score grows.":
        "דינוזאור קטן רץ במדבר ביום ובלילה. קפצו מעל קקטוסים והתכופפו מתחת לציפורים מעופפות. המדבר מאיץ ככל ששורדים יותר, והשמיים מתחלפים בין יום ללילה ככל שהניקוד עולה.",
    "Help a brave little chicken fly through a sky full of pipes. Chickens aren't great at flying, so every flap counts. Each tap gives it a small hop upward, and gravity pulls it back down. Fly through the gap between each pair of pipes to score a point. It's simple to learn and very hard to master.":
        "עזרו לתרנגולת קטנה ואמיצה לעוף בשמיים מלאי צינורות. תרנגולות לא ממש יודעות לעוף, אז כל נפנוף חשוב. כל נגיעה מקפיצה אותה קצת למעלה, וכוח המשיכה מושך אותה בחזרה למטה. עופו דרך הרווח בין כל זוג צינורות כדי לקבל נקודה. קל ללמוד וקשה מאוד לשלוט.",
    "Steer a growing snake around the board and eat the food. Every bite makes the snake longer and adds to your score. Crash into a wall or into your own tail and the game is over.":
        "הזיזו נחש שגדל על הלוח ואכלו את האוכל. כל ביס מאריך את הנחש ומוסיף נקודות. אם נתקלים בקיר או בזנב של עצמכם, המשחק נגמר.",
    "Race through the maze eating every dot while colourful ghosts chase you. Eat all the dots to win the level. If a ghost catches you, you lose a life. You have three lives to clear the board.":
        "רוצו במבוך ואכלו כל נקודה בזמן שרוחות צבעוניות רודפות אחריכם. אכלו את כל הנקודות כדי לנצח בשלב. אם רוח תופסת אתכם, אתם מאבדים חיים. יש לכם שלושה חיים לנקות את הלוח.",
    "Shapes made of four blocks fall from the top of the board. Move and rotate them so they fit together. A full horizontal line disappears and gives you points, and clearing more lines at once gives bigger bonuses. The pieces fall faster at every level.":
        "צורות של ארבעה בלוקים נופלות מלמעלה. הזיזו וסובבו אותן כך שיתאימו זו לזו. שורה מלאה נעלמת ונותנת נקודות, וניקוי כמה שורות בבת אחת נותן בונוס גדול יותר. בכל שלב החלקים נופלים מהר יותר.",
    "A colourful 3D platform adventure. Run and jump across the level, stomp on enemies, collect coins and reach the flag at the end to clear the course. You have three lives, so be careful near the gaps.":
        "הרפתקת פלטפורמה צבעונית בתלת־ממד. רוצו וקפצו לאורך השלב, קפצו על אויבים, אספו מטבעות והגיעו לדגל בסוף. יש לכם שלושה חיים, אז היזהרו ליד הבורות.",
    "Trap the monsters inside bubbles, then pop them for points. Jump between platforms, blow bubbles at the enemies and clear every monster to move to the next level. Watch out: touching a monster costs you a life.":
        "לכדו את המפלצות בתוך בועות ואז פוצצו אותן בשביל נקודות. קפצו בין פלטפורמות, נשפו בועות על האויבים ונקו את כל המפלצות כדי לעבור לשלב הבא. היזהרו: נגיעה במפלצת עולה בחיים.",
    "A full game of chess for two players on the same screen. Click a piece to see every move it can make, then click a square to move it. Castling, en passant and pawn promotion are all included, and you can undo a move if someone slips.":
        "משחק שחמט מלא לשני שחקנים על אותו מסך. לחצו על כלי כדי לראות לאן הוא יכול לזוז, ואז לחצו על משבצת כדי להזיז אותו. יש הצרחה, הכאה דרך הילוכו והכתרת רגלי, ואפשר לבטל מהלך אם מישהו טעה.",
    "Ride a motorbike down a busy road. Speed up, weave between cars and see how far you can get before you crash. The faster you go, the more points you earn, but there's less time to react.":
        "רכבו על אופנוע בכביש עמוס. האיצו, עברו בין המכוניות ובדקו כמה רחוק תגיעו לפני שתתנגשו. ככל שנוסעים מהר יותר מקבלים יותר נקודות, אבל יש פחות זמן להגיב.",
    "A fast one-on-one football match against the computer. Run into the ball to kick it toward the goal on the right, and stop the computer from scoring in yours. Whoever has more goals when the 90 seconds run out wins.":
        "משחק כדורגל מהיר אחד על אחד נגד המחשב. רוצו אל הכדור כדי לבעוט אותו לשער מימין, ותמנעו מהמחשב להבקיע בשער שלכם. מי שיש לו יותר גולים כשנגמרות 90 השניות מנצח.",
    // controls
    "Space / click / tap": "רווח / לחיצה / נגיעה", "Jump": "קפיצה", "Arrow keys / WASD": "חצים / WASD", "Fly": "טיסה", "Space": "רווח", "Fire": "ירייה", "Phone": "טלפון",
    "Drag to fly, it fires by itself": "גוררים כדי לטוס, היריות אוטומטיות", "Slide the tiles": "הזזת האריחים", "Swipe": "החלקה", "Undo": "ביטול", "Take back your last move": "מבטל את המהלך האחרון",
    "Mouse / finger": "עכבר / אצבע", "Move the paddle": "הזזת המחבט", "Arrow keys": "חצים", "Click / Space": "לחיצה / רווח", "Launch the ball": "שיגור הכדור", "Click / tap": "לחיצה / נגיעה",
    "Flip a card": "הפיכת קלף", "Left / right arrows": "חץ ימינה / שמאלה", "Change lane": "החלפת מסלול", "Up / Space": "למעלה / רווח", "Swipe left, right or up": "החלקה שמאלה, ימינה או למעלה",
    "Space / Up": "רווח / למעלה", "Down": "למטה", "Duck": "התכופפות", "Tap to jump": "נגיעה לקפיצה", "Flap": "נפנוף", "Change direction": "שינוי כיוון", "Take a break": "הפסקה",
    "Move through the maze": "תזוזה במבוך", "Left / right": "ימינה / שמאלה", "Move": "תזוזה", "Up / Space / Z": "למעלה / רווח / Z", "Rotate": "סיבוב", "Drop faster": "הפלה מהירה",
    "Arrow keys / joystick": "חצים / ג'ויסטיק", "Up / A button": "למעלה / כפתור A", "Move and jump": "תזוזה וקפיצה", "A": "A", "Blow a bubble": "ניפוח בועה", "Click": "לחיצה",
    "Select a piece, then click where to move": "בוחרים כלי ואז לוחצים לאן להזיז", "Take back the last move": "מבטל את המהלך האחרון", "Steer": "היגוי", "Accelerate": "האצה", "Move your player": "הזזת השחקן",
    // tips
    "Jump a moment before you reach a spike, not when you are on top of it.": "קפצו רגע לפני הקוץ, לא כשאתם כבר עליו.", "Watch the shape coming next instead of your own square.": "הסתכלו על הצורה הבאה ולא על הריבוע שלכם.",
    "Short practice runs help you learn the rhythm of each level.": "ריצות אימון קצרות עוזרות ללמוד את הקצב של כל שלב.", "Keep moving: standing still makes you an easy target for diving aliens.": "תמשיכו לזוז: מי שעומד במקום הוא מטרה קלה לחייזרים הצוללים.",
    "Gold aliens take two hits, so finish them before they reach you.": "חייזרים מזהב צריכים שתי פגיעות, אז סיימו אותם לפני שהם מגיעים אליכם.", "Save the shield power-up for boss waves if you can.": "אם אפשר, שמרו את המגן לגלי הבוס.",
    "Pick a corner and keep your biggest tile there.": "בחרו פינה ושמרו בה את האריח הכי גדול.", "Avoid the direction that pulls your big tile out of its corner.": "הימנעו מהכיוון שמוציא את האריח הגדול מהפינה.",
    "Build a chain of numbers that get smaller as they move away from the corner.": "בנו שרשרת מספרים שקטנים ככל שמתרחקים מהפינה.", "Hit the ball with the edge of the paddle to send it sideways.": "פגעו בכדור עם קצה המחבט כדי לשלוח אותו הצידה.",
    "Break a hole through to the top and let the ball bounce around up there.": "פרצו חור עד למעלה ותנו לכדור לקפוץ שם.", "Catch the star power-up: a wider paddle makes the fast levels much easier.": "תפסו את הכוכב: מחבט רחב הופך את השלבים המהירים להרבה יותר קלים.",
    "Flip cards in order, row by row, so they are easier to remember.": "הפכו קלפים לפי הסדר, שורה אחרי שורה, כדי שיהיה קל לזכור.", "Say the picture out loud in your head when you see it.": "תגידו בראש את שם התמונה כשאתם רואים אותה.",
    "On Hard, focus on one corner of the board at a time.": "ברמה קשה, התמקדו בפינה אחת של הלוח בכל פעם.", "Look at the far end of the track, not at your runner.": "הסתכלו לסוף המסלול, לא על הרץ שלכם.",
    "Barriers can be jumped, trains cannot. Change lanes for those.": "מעל מחסומים אפשר לקפוץ, מעל רכבות לא. בשביל רכבות מחליפים מסלול.", "A line of coins is often the safest path.": "שורת מטבעות היא הרבה פעמים הדרך הכי בטוחה.",
    "Birds can fly low, middle or high. Duck only for the low and middle ones.": "ציפורים עפות נמוך, באמצע או גבוה. התכופפו רק לנמוכות ולאמצעיות.", "Holding Down while in the air makes you land faster.": "לחיצה על למטה באוויר מנחיתה מהר יותר.",
    "Groups of three cactuses need an early jump.": "קבוצה של שלושה קקטוסים צריכה קפיצה מוקדמת.", "Tap gently and often instead of big jumps.": "נגעו בעדינות ולעיתים קרובות במקום קפיצות גדולות.",
    "Aim for the middle of each gap, not the edges.": "כוונו לאמצע של כל רווח, לא לקצוות.", "Stay calm after a high score. Rushing is what usually ends a run.": "תישארו רגועים אחרי ניקוד גבוה. בדרך כלל הלחץ הוא מה שגומר את הריצה.",
    "Move along the edges of the board to keep the middle free.": "זוזו לאורך קצות הלוח כדי שהאמצע יישאר פנוי.", "Plan your path a few moves ahead once the snake gets long.": "כשהנחש ארוך, תכננו את הדרך כמה מהלכים קדימה.",
    "Never turn back toward your own tail.": "אף פעם אל תסתובבו לכיוון הזנב שלכם.", "Clear one area of the maze at a time.": "נקו אזור אחד במבוך בכל פעם.",
    "Watch where the ghosts are before turning into a long corridor.": "בדקו איפה הרוחות לפני שנכנסים למסדרון ארוך.", "Leave a few dots near an escape route for the end.": "השאירו כמה נקודות ליד דרך מילוט לסוף.",
    "Keep the board flat, with no tall towers.": "שמרו על לוח שטוח, בלי מגדלים גבוהים.", "Leave one column open for the long straight piece.": "השאירו טור אחד פתוח בשביל החלק הישר הארוך.",
    "Check the next piece box to plan ahead.": "הסתכלו על החלק הבא כדי לתכנן מראש.", "Jump on enemies from above to defeat them.": "קפצו על אויבים מלמעלה כדי להביס אותם.",
    "Coins are often placed above safe jumps.": "מטבעות נמצאים הרבה פעמים מעל קפיצות בטוחות.", "Take your time near gaps. Falling costs a life.": "אל תמהרו ליד בורות. נפילה עולה בחיים.",
    "Shoot bubbles from a platform above the monsters.": "ירו בועות מפלטפורמה מעל המפלצות.", "Pop trapped monsters quickly before they escape.": "פוצצו מפלצות לכודות מהר לפני שהן בורחות.",
    "Keep moving so monsters can't corner you.": "תמשיכו לזוז כדי שהמפלצות לא ילכדו אתכם בפינה.", "Control the centre of the board early.": "השתלטו על מרכז הלוח מוקדם.",
    "Move each piece once before moving one piece twice.": "הזיזו כל כלי פעם אחת לפני שמזיזים כלי פעמיים.", "Castle early to keep your king safe.": "הצריחו מוקדם כדי לשמור על המלך.",
    "Speed up on empty stretches and slow down in traffic.": "האיצו בקטעים ריקים והאטו בפקקים.", "Stay near the middle of the road so you can dodge either way.": "הישארו קרוב לאמצע הכביש כדי שתוכלו להתחמק לשני הצדדים.",
    "Watch the cars two lanes ahead, not just the next one.": "הסתכלו על המכוניות שני נתיבים קדימה, לא רק על הבאה.", "Approach the ball from behind to kick it toward the goal.": "הגיעו לכדור מאחור כדי לבעוט אותו לכיוון השער.",
    "Fall back to defend after you shoot.": "אחרי בעיטה חזרו להגנה.", "Shots near the corners of the goal are hardest to stop.": "בעיטות לפינות השער הכי קשות לעצירה."
};
Object.assign(TEXT, INFO, NAMES);

// ---------- Text with numbers in it ----------
const PATTERNS = [
    [/^Score ([\d,]+) (points|pipes|goals|blocks|rounds|wins in a row|cupcakes) in (.+)$/, (m, n, u, g) => `השיגו ${n} ${UNITS[u]} ב${gn(g)}`],
    [/^(.+) master$/, (m, g) => `אלוף ${gn(g)}`],
    [/^(🎮 Playing|⭐ Skill|📅 Daily|💬 Social|🌐 Online|👑 Game masters) · (\d+) of (\d+)$/, (m, c, a, b) => `${{ "🎮 Playing": "🎮 משחק", "⭐ Skill": "⭐ מיומנות", "📅 Daily": "📅 יומי", "💬 Social": "💬 חברתי", "🌐 Online": "🌐 אונליין", "👑 Game masters": "👑 אלופי משחקים" }[c]} · ${a} מתוך ${b}`],
    [/^([\d,]+) XP$/, (m, n) => `${n} XP`],
    [/^(\d+) plays?$/, (m, n) => `${n} משחקים`],
    [/^score ([\d,]+) (points|pipes|goals) in (.+)$/, (m, n, u, g) => `השיגו ${n} ${UNITS[u]} ב${gn(g)}`],
    [/^Finish it today for \+40 XP and keep your streak going\.$/, () => "סיימו היום וקבלו 40+ XP, ותשמרו על הרצף."],
    [/^✅ Done for today! A new challenge comes tomorrow\.$/, () => "✅ סיימתם להיום! מחר יש אתגר חדש."],
    [/^Score ([\d,]+) (points|pipes|goals) in this game today to complete it and earn 40 XP\.$/, (m, n, u) => `השיגו היום ${n} ${UNITS[u]} במשחק הזה כדי להשלים את האתגר ולקבל 40 XP.`],
    [/^(\d+) games?$/, (m, n) => `${n} משחקים`],
    [/^(\d+) of (\d+)$/, (m, a, b) => `${a} מתוך ${b}`],
    [/^([\d,]+) \/ ([\d,]+) XP to level (\d+)$/, (m, a, b, l) => `${a} / ${b} XP לרמה ${l}`],
    [/^Lv (\d+)$/, (m, n) => `רמה ${n}`],
    [/^(\d+) min read$/, (m, n) => `${n} דקות קריאה`],
    [/^Member since (.+)$/, (m, d) => `חבר מאז ${d}`],
    [/^★ Premium since (.+)$/, (m, d) => `★ פרימיום מאז ${d}`],
    [/^(\d+) plays? · last (.+)$/, (m, n, d) => `${n} משחקים · לאחרונה ${d}`],
    [/^🏆 Best: ([\d,]+)$/, (m, n) => `🏆 שיא: ${n}`],
    [/^Best:$/, () => "שיא:"],
    [/^Score ([\d,]+)$/, (m, n) => `ניקוד ${n}`],
    [/^Score ([\d,]+) · ([\d,]+) coins$/, (m, n, c) => `ניקוד ${n} · ${c} מטבעות`],
    [/^Score ([\d,]+) · reached wave (\d+)$/, (m, n, w) => `ניקוד ${n} · הגעתם לגל ${w}`],
    [/^Score ([\d,]+) · reached level (\d+)$/, (m, n, w) => `ניקוד ${n} · הגעתם לשלב ${w}`],
    [/^Score ([\d,]+) · keep going if you like$/, (m, n) => `ניקוד ${n} · אפשר להמשיך`],
    [/^(\d+) moves · (\d+)s · score ([\d,]+)$/, (m, a, s, n) => `${a} מהלכים · ${s} שניות · ניקוד ${n}`],
    [/^🏆 New personal best: ([\d,]+)!(.*)$/, (m, n, rest) => `🏆 שיא אישי חדש: ${n}!${rest ? " " + tr(rest.trim()) : ""}`],
    [/^📊 You're #(\d+) on this week's leaderboard!$/, (m, r) => `📊 אתם במקום ${r} בטבלה השבועית!`],
    [/^(.+) is Premium$/, (m, g) => `${gn(g)} הוא משחק פרימיום`],
    [/^(.+) is in early access$/, (m, g) => `${gn(g)} בגישה מוקדמת`],
    [/^About (.+)$/, (m, g) => `על ${gn(g)}`],
    [/^▶ Play (.+)$/, (m, g) => `▶ לשחק ב${gn(g)}`],
    [/^(.+) · Noam's Game Hub$/, (m, t) => `${tr(t)} · המשחקים של נועם`],
    [/^(.+) skin saved$/, (m, g) => `הסקין ב${gn(g)} נשמר`],
    [/^(Classic|Gold|Pink|Violet|Ghost|Red|Green|Shadow|Blue|White) (Ship|Hoodie|Dino|Paddle)$/, (m, c, t) =>
        `${{ Ship: "חללית", Hoodie: "קפוצ'ון", Dino: "דינו", Paddle: "מחבט" }[t]} ${{ Classic: "קלאסי", Gold: "זהב", Pink: "ורוד", Violet: "סגול", Ghost: "רוח", Red: "אדום", Green: "ירוק", Shadow: "צל", Blue: "כחול", White: "לבן" }[c]}`],
    [/^Game Over! Final Score: ([\d,]+) \| Lines: (\d+) \| Level: (\d+)$/, (m, n, l, v) => `המשחק נגמר! ניקוד סופי: ${n} | שורות: ${l} | שלב: ${v}`],
    [/^Game Over! (?:Final )?Score: ([\d,]+)$/, (m, n) => `המשחק נגמר! ניקוד: ${n}`],
    [/^Game Over! New High Score: ([\d,]+)$/, (m, n) => `המשחק נגמר! שיא חדש: ${n}`],
    [/^You Won! Final Score: ([\d,]+)$/, (m, n) => `ניצחתם! ניקוד סופי: ${n}`],
    [/^🎉 YOU WIN! (\d+) - (\d+)$/, (m, a, b) => `🎉 ניצחתם! ${a} - ${b}`],
    [/^😢 YOU LOSE! (\d+) - (\d+)$/, (m, a, b) => `😢 הפסדתם! ${a} - ${b}`],
    [/^🤝 DRAW! (\d+) - (\d+)$/, (m, a, b) => `🤝 תיקו! ${a} - ${b}`],
    [/^Checkmate! (White|Black) wins!$/, (m, c) => `מט! ${c === "White" ? "הלבן" : "השחור"} ניצח!`],
    [/^Time: (\d+)s$/, (m, n) => `זמן: ${n} שניות`],
    [/^You: (\d+)$/, (m, n) => `אתם: ${n}`],
    [/^AI: (\d+)$/, (m, n) => `מחשב: ${n}`],
    [/^Speed: (\d+) km\/h$/, (m, n) => `מהירות: ${n} קמ"ש`],
    [/^No scores yet (this week)?\. Be the first!.*$/, () => "עדיין אין שיאים. היו הראשונים!"],
    [/^Your name needs at least 2 characters\.$/, () => "השם צריך לפחות 2 תווים."],
    [/^Please keep your name to 20 characters or less\.$/, () => "השם יכול להיות עד 20 תווים."],
    [/^Names can't have links or emails in them\.$/, () => "אסור קישורים או אימיילים בשם."],
    [/^⚠️ (.+) Change it to appear on the leaderboards\.$/, (m, p) => `⚠️ ${tr(p)} שנו אותו כדי להופיע בטבלאות השיאים.`],
    [/^Change your name on your profile to appear on the leaderboard$/, () => "שנו את השם בפרופיל כדי להופיע בטבלת השיאים"]
];

// Whole-element sentences that contain numbers
const BLOCK_PATTERNS = [
    [/^🎮 (\d+) games · no downloads · free account saves your scores$/, (m, n) => `🎮 <span id="gameCount">${n}</span> משחקים · בלי הורדות · חשבון חינמי שומר את השיאים שלך`],
    [/^Score ([\d,]+) (points|pipes|goals) in this game today to complete it and earn 40 XP\.( Log in to take part\.)?$/,
        (m, n, u, login) => `השיגו היום <b>${n} ${UNITS[u]}</b> במשחק הזה כדי להשלים את האתגר ולקבל 40 XP.${login ? ' <a href="/login" style="color:#2ee6c9">התחברו</a> כדי להשתתף.' : ""}`],
    [/^Best: ([\d,]+) · Power-ups: ◆ double shot · ♥ extra life · ◎ shield$/, (m, n) => `שיא: <b id="best">${n}</b> · שדרוגים: <span style="color:#2ee6c9">◆ ירייה כפולה</span> · <span style="color:#ff4d8d">♥ חיים נוספים</span> · <span style="color:#ffc94d">◎ מגן</span>`],
    [/^Best: ([\d,]+) · Gold bricks take two hits · catch the ★ for a wider paddle$/, (m, n) => `שיא: <b id="best">${n}</b> · לבנים מזהב צריכות שתי פגיעות · תפסו את ה־★ למחבט רחב`],
    [/^📅 Today's challenge: score ([\d,]+) (points|pipes|goals) in (.+?) (Finish it today for \+40 XP\.|✅ Done! Come back tomorrow for a new one\.)(.*)$/,
        (m, n, u, g, st, rest) => `<b>📅 האתגר של היום:</b> השיגו ${n} ${UNITS[u]} ב${gn(g)}<p>${st.startsWith("✅") ? "✅ סיימת! מחר יש אתגר חדש." : "סיימו היום וקבלו 40+ XP."}${(rest.match(/🔥 (\d+)-day streak/) || [])[1] ? ` · 🔥 רצף של ${rest.match(/🔥 (\d+)-day streak/)[1]} ימים` : ""}</p>`]
];

function keyOf(el) {
    // text of an element, treating <br> as a space
    let out = "";
    const walk = (n) => { for (const c of n.childNodes) { if (c.nodeType === 3) out += c.nodeValue; else if (c.nodeName === "BR") out += " "; else if (c.nodeType === 1) walk(c); } };
    walk(el);
    return norm(out);
}
const INLINE_ONLY = (el) => [...el.querySelectorAll("*")].every((c) => ["SPAN", "B", "STRONG", "EM", "I", "BR"].includes(c.nodeName) && !c.id);

function tr(s) {
    if (Object.prototype.hasOwnProperty.call(TEXT, s)) return TEXT[s];
    for (const [re, fn] of PATTERNS) { const m = s.match(re); if (m) return fn(...m); }
    return null;
}

// ---------- Engine ----------
const SKIP = "script,style,code,pre,canvas,textarea,input,select,.nm,#userName,#name,.name,.gh-lb td:nth-child(2),.mini-card span,[data-noi18n],.code,.gh-announce span";
const BLOCK_SEL = "h1,h2,h3,p,li,summary,.badge,.daily-card .dc-body b,.hint,.overlay p";
const norm = (s) => s.replace(/\s+/g, " ").trim();

function translateTree(root) {
    if (!root || root.nodeType !== 1 && root.nodeType !== 9) return;
    const base = root.nodeType === 9 ? root.body : root;
    if (!base) return;
    // 1) whole sentences
    const blocks = [base, ...base.querySelectorAll(BLOCK_SEL + ",footer,.badge,.gift,.lockmsg,.upsell span:first-child,.daily > div,.gh-info section p")];
    for (const el of blocks) {
        if (el.closest && el.closest(SKIP)) continue;
        if (el.dataset && el.dataset.i18nDone) continue;
        const key = keyOf(el);
        if (!key || !/[A-Za-z]/.test(key)) continue;
        if (BLOCKS[key]) { el.innerHTML = BLOCKS[key]; el.dataset.i18nDone = "1"; continue; }
        let done = false;
        for (const [re, fn] of BLOCK_PATTERNS) { const m = key.match(re); if (m) { el.innerHTML = fn(...m); el.dataset.i18nDone = "1"; done = true; break; } }
        if (done) continue;
        // a title split into coloured pieces, e.g. <h1>Space <span>Shooter</span></h1>
        if (el.children.length && INLINE_ONLY(el)) {
            const out = tr(key);
            if (out != null) { el.textContent = out; el.dataset.i18nDone = "1"; }
        }
    }
    // 2) single text pieces
    const w = document.createTreeWalker(base, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let n; while ((n = w.nextNode())) nodes.push(n);
    for (const t of nodes) {
        const p = t.parentElement;
        if (!p || p.closest(SKIP)) continue;
        const raw = t.nodeValue, key = norm(raw);
        if (!key || !/[A-Za-z]/.test(key)) continue;
        const out = tr(key);
        if (out != null) t.nodeValue = raw.replace(key, out);
    }
    // 3) attributes
    base.querySelectorAll("[placeholder],[title],[aria-label]").forEach((el) => {
        if (el.closest("[data-noi18n]")) return;
        for (const a of ["placeholder", "title", "aria-label"]) {
            const v = el.getAttribute(a); if (!v) continue;
            const out = tr(norm(v)); if (out != null) el.setAttribute(a, out);
        }
    });
}

let observer;
export function startHebrew({ gamePage = false } = {}) {
    const html = document.documentElement;
    html.lang = "he"; html.classList.add("he");
    if (!gamePage) html.dir = "rtl";
    const st = document.createElement("style");
    st.textContent = `
      html.he body{font-family:'Rubik','Heebo',Inter,system-ui,sans-serif}
      html.he .gh-info,html.he .gh-lock,html.he .gh-toast,html.he .gh-ad,html.he .gh-announce,html.he .gbar,html.he .overlay,html.he .hint{direction:rtl!important}
      html.he .gh-info{text-align:right!important}
      html.he .gh-info td:first-child{text-align:right}
      html.he .touch,html.he .stage canvas,html.he .board,html.he .grid#grid .thumb{direction:ltr}
      html.he .tag{right:auto} html.he .tag.prem{right:auto;left:10px} html.he .tag:not(.prem){left:auto;right:10px}
      html.he .heart{right:auto;left:8px}
      html.he .gh-announce button{right:auto;left:10px}
      html.he .dropdown{right:auto;left:0}
      html.he .more-drop{left:auto;right:0}
      html.he .user-menu .dropdown a,html.he .user-menu .dropdown button{text-align:right!important}`;
    document.head.appendChild(st);
    const f = document.createElement("link");
    f.rel = "stylesheet"; f.href = "https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;800&display=swap";
    document.head.appendChild(f);
    const run = () => {
        translateTree(document);
        document.title = tr(norm(document.title)) || document.title;
        const legal = /^\/(terms|privacy|articles\/.*)$/.test(location.pathname);
        if (legal && !document.getElementById("heNote")) {
            const note = document.createElement("div");
            note.id = "heNote"; note.dir = "rtl";
            note.style.cssText = "max-width:760px;margin:20px auto 0;padding:12px 16px;border-radius:12px;background:#ffc94d22;color:#ffc94d;font:700 14px Rubik,system-ui,sans-serif;text-align:center";
            note.textContent = "העמוד הזה זמין כרגע באנגלית בלבד.";
            const article = document.querySelector("article");
            article ? article.before(note) : document.body.prepend(note);
        }
    };
    run();
    if (gamePage) {
        // extra Hebrew for the games, plus text the games draw on their canvas
        const memo = new Map();
        const canvasTr = (x) => {
            if (typeof x !== "string" || !/[A-Za-z]/.test(x)) return x;
            if (!memo.has(x)) { const o = tr(norm(x)); memo.set(x, o == null ? x : o); }
            return memo.get(x);
        };
        import("./i18n-games.js").then((m) => {
            Object.assign(TEXT, m.TEXT); PATTERNS.push(...m.PATTERNS); memo.clear();
            if (window.Kit) window.Kit.tr = canvasTr;
            observer && observer.disconnect();
            run();
            observer && observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        }).catch(() => {});
    }
    observer = new MutationObserver((muts) => {
        observer.disconnect();
        for (const m of muts) {
            if (m.type === "characterData") translateTree(m.target.parentElement);
            for (const node of m.addedNodes || []) {
                if (node.nodeType === 1) translateTree(node);
                else if (node.nodeType === 3 && node.parentElement) translateTree(node.parentElement);
            }
            if (m.type === "childList" && m.target.nodeType === 1 && !m.addedNodes.length) continue;
            if (m.type === "childList" && m.target.nodeType === 1) translateTree(m.target);
        }
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}

// ---------- Language button ----------
export function addLangButton(lang) {
    const label = lang === "he" ? "🌐 EN" : "🌐 עב";
    const make = (tag = "button") => {
        const b = document.createElement(tag);
        b.textContent = label; b.className = "gh-lang"; b.dataset.noi18n = "1";
        b.onclick = (e) => { e.preventDefault(); setLang(lang === "he" ? "en" : "he"); };
        return b;
    };
    const st = document.createElement("style");
    st.textContent = `.gh-lang{border:1px solid #2a3060;background:#171b36;color:#eef0ff;border-radius:999px;padding:6px 12px;font:700 13px Inter,Rubik,system-ui,sans-serif;cursor:pointer}
      .gh-lang:hover{border-color:#7c5cff}
      .gh-lang.float{position:fixed;bottom:14px;left:14px;z-index:9000;box-shadow:0 8px 20px rgba(0,0,0,.4)}`;
    document.head.appendChild(st);
    const nav = document.getElementById("navLinks");
    if (nav) { const li = document.createElement("li"); li.appendChild(make()); nav.insertBefore(li, nav.querySelector("#account")); return; }
    const bar = document.querySelector(".gbar, .navbar .me, .nav-actions");
    if (bar) { bar.appendChild(make()); return; }
    const info = document.querySelector(".gh-info");
    if (info) { const sec = document.createElement("section"); sec.appendChild(make()); info.appendChild(sec); return; }
    const b = make(); b.classList.add("float"); document.body.appendChild(b);
}

export { NAMES };
