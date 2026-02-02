'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown, ChevronUp, BookOpen, MapPin, Calendar,
    Star, Heart, Users, Scroll
} from 'lucide-react';

interface Prophet {
    id: number;
    name: string;
    arabicName: string;
    title: string;
    era: string;
    location: string;
    mentionsInQuran: number;
    keyEvents: string[];
    lessons: string[];
    story: string;
    detailedHistory: string[];
}

const PROPHETS: Prophet[] = [
    {
        id: 1,
        name: 'Adam',
        arabicName: 'آدم',
        title: 'The First Human',
        era: 'Beginning of Creation',
        location: 'Paradise & Earth',
        mentionsInQuran: 25,
        keyEvents: [
            'Created from clay by Allah',
            'Taught the names of all things',
            'Angels prostrated to him except Iblis',
            'Placed in Paradise with Hawwa (Eve)',
            'Deceived by Shaytan and ate from forbidden tree',
            'Sent down to Earth',
            'Repented and was forgiven by Allah',
            'First Prophet to humanity'
        ],
        lessons: [
            'Humility before Allah',
            'Dangers of arrogance (as shown by Iblis)',
            'Power of repentance (Tawbah)',
            'Shaytan is the open enemy of mankind'
        ],
        story: 'Adam (AS) was the first human and prophet, created by Allah from clay. Allah taught him the names of all things and commanded the angels to prostrate to him.',
        detailedHistory: [
            'Allah announced to the angels His intention to create a vicegerent on Earth. The angels questioned this, but Allah informed them that He knew what they did not know.',
            'Adam was created from different types of soil from the Earth, which is why humans come in various colors and characteristics.',
            'Allah shaped Adam with His own hands and breathed into him from His spirit, giving him life.',
            'Allah taught Adam the names of all things, knowledge that even the angels did not possess.',
            'All angels were commanded to prostrate to Adam as a sign of respect. All obeyed except Iblis (Satan), who refused out of arrogance.',
            'Iblis argued that he was created from fire while Adam was created from clay, considering himself superior.',
            'Due to his disobedience, Iblis was expelled from Paradise but was granted respite until the Day of Judgment.',
            'Adam was placed in Paradise and Hawwa (Eve) was created as his companion.',
            'They were allowed everything in Paradise except approaching one tree.',
            'Shaytan deceived them, and they ate from the forbidden tree, causing them to lose their covering of Paradise.',
            'Adam and Hawwa repented sincerely, and Allah accepted their repentance and taught them words of forgiveness.',
            'They were sent down to Earth to live, where Adam became the first Prophet, guiding his children to worship Allah alone.'
        ]
    },
    {
        id: 2,
        name: 'Idris',
        arabicName: 'إدريس',
        title: 'The Steadfast',
        era: 'After Adam',
        location: 'Babylon/Egypt',
        mentionsInQuran: 2,
        keyEvents: [
            'Known for his truthfulness and patience',
            'First to write with a pen',
            'First to study astronomy and mathematics',
            'Raised to a high station by Allah',
            'Known as Enoch in Biblical tradition'
        ],
        lessons: [
            'Importance of seeking knowledge',
            'Value of patience and steadfastness',
            'Combining worship with worldly knowledge'
        ],
        story: 'Idris (AS) was known for his truthfulness and patience. Allah raised him to a high station, and he is believed to be the first to write with a pen.',
        detailedHistory: [
            'Idris was from the descendants of Adam through his son Sheth.',
            'He was the first human to write with a pen, documenting knowledge for future generations.',
            'He was blessed with profound knowledge of astronomy and mathematics.',
            'Idris spent much of his time in worship, dividing his days between teaching and devotion.',
            'Allah praised him in the Quran as truthful and a prophet, and raised him to a high station.',
            'According to some narrations, he was taken up to the heavens while still alive.',
            'He taught people about the oneness of Allah and the importance of righteous living.'
        ]
    },
    {
        id: 3,
        name: 'Nuh',
        arabicName: 'نوح',
        title: 'The Grateful Servant',
        era: 'Approximately 950+ years of prophethood',
        location: 'Mesopotamia',
        mentionsInQuran: 43,
        keyEvents: [
            'Preached for 950 years',
            'Only a few believed despite centuries of dawah',
            'Commanded to build the Ark',
            'The Great Flood destroyed disbelievers',
            'His son refused to board and drowned',
            'The Ark rested on Mount Judi',
            'Humanity repopulated from his followers'
        ],
        lessons: [
            'Patience in calling to Islam',
            'Reliance on Allah despite opposition',
            'Faith is more important than blood relations',
            'Allah\'s help comes to the patient'
        ],
        story: 'Nuh (AS) preached to his people for 950 years, yet only a few believed. Allah commanded him to build an Ark, and the Great Flood destroyed the disbelievers.',
        detailedHistory: [
            'Nuh was sent to his people who had begun worshipping idols named Wadd, Suwa, Yaghuth, Ya\'uq, and Nasr.',
            'He called his people to worship Allah alone day and night, in public and in private.',
            'Despite 950 years of preaching, only about 80 people believed in him.',
            'The leaders of his people mocked him and said only the lowest of society followed him.',
            'Allah commanded Nuh to build a large Ark, and his people mocked him for building a ship far from any sea.',
            'When the command came, water burst from the earth and rain fell from the sky.',
            'Nuh called his family to board the Ark, but his son refused, thinking he could escape to a mountain.',
            'The son drowned along with all the disbelievers.',
            'Nuh asked Allah about his son, but was told that his son was not of his family due to his disbelief.',
            'After the flood, the Ark rested on Mount Judi, and the believers descended to repopulate the Earth.',
            'Nuh is called one of the Ulul Azm (Prophets of strong will) for his immense patience.'
        ]
    },
    {
        id: 4,
        name: 'Hud',
        arabicName: 'هود',
        title: 'Prophet to \'Ad',
        era: 'After Nuh',
        location: 'Ahqaf (Southern Arabia)',
        mentionsInQuran: 7,
        keyEvents: [
            'Sent to the powerful nation of \'Ad',
            '\'Ad were known for building magnificent structures',
            'Called them away from idol worship',
            'People rejected his message',
            'Destroyed by a violent windstorm for 7 nights and 8 days'
        ],
        lessons: [
            'Power and wealth cannot protect from Allah',
            'Arrogance leads to destruction',
            'Allah\'s punishment is severe for the disobedient'
        ],
        story: 'Hud (AS) was sent to the powerful nation of \'Ad, who built magnificent structures but worshipped idols. They rejected him and were destroyed by a violent windstorm.',
        detailedHistory: [
            'The \'Ad were descendants of Nuh who settled in the Ahqaf region of Southern Arabia.',
            'They were physically powerful and known for building lofty pillars and magnificent structures.',
            'Despite their blessings, they turned to idol worship and became arrogant.',
            'Hud was sent from among them, calling them to worship Allah alone.',
            'The leaders of \'Ad accused Hud of foolishness and lying.',
            'Hud reminded them of Allah\'s blessings and warned of punishment.',
            'When they persisted in disbelief, Allah sent a drought upon them.',
            'They saw clouds approaching and rejoiced, thinking it was rain.',
            'Instead, it was a violent windstorm that destroyed them for 7 nights and 8 days.',
            'Only Hud and the believers were saved, protected by Allah\'s mercy.'
        ]
    },
    {
        id: 5,
        name: 'Salih',
        arabicName: 'صالح',
        title: 'Prophet of the She-Camel',
        era: 'After Hud',
        location: 'Hijr (Northern Arabia)',
        mentionsInQuran: 9,
        keyEvents: [
            'Sent to Thamud, successors of \'Ad',
            'Thamud carved homes into mountains',
            'Miracle of the She-Camel from rock',
            'People killed the She-Camel',
            'Destroyed by a mighty blast (earthquake/sound)'
        ],
        lessons: [
            'Miracles do not force belief',
            'Harming Allah\'s signs brings punishment',
            'Previous nations\' fate is a warning'
        ],
        story: 'Salih (AS) was sent to Thamud with the miracle of a She-Camel emerging from rock. When they killed it, they were destroyed by a mighty blast.',
        detailedHistory: [
            'Thamud succeeded the \'Ad in power and also became corrupt.',
            'They carved magnificent homes into mountains, a feat of engineering.',
            'Salih was sent from among them, calling them to Allah.',
            'They demanded a miracle: a pregnant she-camel to emerge from a rock.',
            'Allah granted this miracle, and the she-camel appeared.',
            'Salih warned them not to harm her and to share water with her.',
            'The disbelievers plotted and hamstrung (killed) the she-camel.',
            'Salih told them they had only three days before punishment.',
            'On the third day, a mighty blast (earthquake or sound) destroyed them.',
            'Only Salih and the believers were saved, having left the city.'
        ]
    },
    {
        id: 6,
        name: 'Ibrahim',
        arabicName: 'إبراهيم',
        title: 'The Friend of Allah (Khalilullah)',
        era: 'Approximately 1900 BCE',
        location: 'Ur, Palestine, Makkah',
        mentionsInQuran: 69,
        keyEvents: [
            'Debated with his father about idol worship',
            'Smashed the idols of his people',
            'Thrown into fire but miraculously saved',
            'Migrated to Palestine and Egypt',
            'Given Ismail and Ishaq as sons in old age',
            'Built the Kaaba with Ismail',
            'Commanded to sacrifice Ismail, replaced by a ram',
            'Established Hajj rituals'
        ],
        lessons: [
            'Firm belief despite all odds',
            'Willingness to sacrifice for Allah',
            'Breaking from false traditions',
            'Complete submission to Allah\'s commands'
        ],
        story: 'Ibrahim (AS) is known as Khalilullah (Friend of Allah). He debated idol worship, was thrown into fire but saved, built the Kaaba, and was tested with sacrificing his son.',
        detailedHistory: [
            'Ibrahim was born in Ur (modern Iraq) to an idol-maker named Azar.',
            'From childhood, he questioned the worship of idols, stars, moon, and sun.',
            'He used logic to prove that only the eternal Creator deserves worship.',
            'He smashed all the idols except the largest and placed the axe on it.',
            'When questioned, he told them to ask the large idol, exposing their irrationality.',
            'King Nimrod ordered him thrown into a massive fire.',
            'Allah commanded the fire to be cool and peaceful for Ibrahim.',
            'He emerged unharmed, and migrated with his wife Sarah and nephew Lut.',
            'Unable to have children, Sarah gave her servant Hajar to Ibrahim.',
            'Hajar bore Ismail, and later Allah blessed Sarah with Ishaq in old age.',
            'Ibrahim was commanded to leave Hajar and baby Ismail in the barren valley of Makkah.',
            'The story of Zamzam: when water ran out, Hajar ran between Safa and Marwa, and Zamzam miraculously appeared.',
            'Ibrahim returned and was commanded to sacrifice Ismail. Both submitted to Allah\'s will.',
            'Allah replaced Ismail with a ram, and this is commemorated in Eid al-Adha.',
            'Ibrahim and Ismail built the Kaaba together and established the rituals of Hajj.',
            'Ibrahim is the father of the Prophets - through Ishaq came Yaqub and the Israelite prophets, through Ismail came Muhammad ﷺ.'
        ]
    },
    {
        id: 7,
        name: 'Lut',
        arabicName: 'لوط',
        title: 'Prophet to Sodom',
        era: 'Contemporary with Ibrahim',
        location: 'Sodom (near Dead Sea)',
        mentionsInQuran: 27,
        keyEvents: [
            'Nephew of Ibrahim',
            'Sent to people of Sodom and Gomorrah',
            'People engaged in unprecedented sins',
            'Angels came as guests, people sought evil',
            'Warned to leave the city at night',
            'City destroyed by stones from sky',
            'His wife remained and perished'
        ],
        lessons: [
            'Prohibition of fahisha (immorality)',
            'Evil companions lead to destruction',
            'Even family ties cannot save from punishment'
        ],
        story: 'Lut (AS) was sent to Sodom whose people engaged in grave sins. Angels came to warn him, and the city was destroyed by stones from the sky.',
        detailedHistory: [
            'Lut was the nephew of Ibrahim and believed in him.',
            'He was sent to the people of Sodom and nearby cities near the Dead Sea.',
            'The people of Sodom practiced homosexuality, highway robbery, and open evil.',
            'Lut preached against their behavior but was mocked and threatened with expulsion.',
            'Angels came in the form of handsome young men to test the people and warn Lut.',
            'The evil people rushed seeking the guests for their sinful purposes.',
            'Lut offered an alternative but they persisted in their evil.',
            'The angels revealed their identity and told Lut to leave at night with his family.',
            'His wife was a disbeliever and was told not to look back.',
            'At dawn, the cities were overturned and pelted with stones of marked clay.',
            'The area is believed to be the Dead Sea region, barren to this day.'
        ]
    },
    {
        id: 8,
        name: 'Ismail',
        arabicName: 'إسماعيل',
        title: 'The Sacrificed One',
        era: 'Son of Ibrahim',
        location: 'Makkah',
        mentionsInQuran: 12,
        keyEvents: [
            'Left in Makkah with mother Hajar as an infant',
            'Zamzam water appeared for him',
            'Willingly submitted to sacrifice',
            'Replaced by a ram from Allah',
            'Helped Ibrahim build the Kaaba',
            'Ancestor of Prophet Muhammad ﷺ'
        ],
        lessons: [
            'Complete submission to Allah',
            'Trust in Allah\'s plan',
            'Obedience to parents'
        ],
        story: 'Ismail (AS) was the son of Ibrahim who willingly submitted when his father was commanded to sacrifice him. Allah ransomed him with a ram.',
        detailedHistory: [
            'Born to Ibrahim and Hajar, he was the first child of Ibrahim in his old age.',
            'As a baby, he was left with his mother in the barren valley of Makkah by Allah\'s command.',
            'When water ran out, his mother Hajar ran between Safa and Marwa seeking help.',
            'Angel Jibreel struck the ground, and Zamzam water gushed forth.',
            'The tribe of Jurhum settled there due to the water, and Ismail grew among them.',
            'When he was old enough to work, Ibrahim saw in a dream that he should sacrifice him.',
            'Ismail said: "Do what you are commanded. You will find me patient, if Allah wills."',
            'Allah ransomed him with a great sacrifice (a ram).',
            'Father and son together built the Kaaba and prayed for righteous descendants.',
            'Ismail is described in the Quran as true to his promise and a messenger prophet.',
            'Prophet Muhammad ﷺ is from his lineage through the Arabs of Makkah.'
        ]
    },
    {
        id: 9,
        name: 'Ishaq',
        arabicName: 'إسحاق',
        title: 'The Gift in Old Age',
        era: 'Son of Ibrahim',
        location: 'Palestine',
        mentionsInQuran: 17,
        keyEvents: [
            'Born to Ibrahim and Sarah in extreme old age',
            'Announced by angels visiting Ibrahim',
            'Sarah laughed in disbelief at the news',
            'Father of Yaqub (Jacob)',
            'Ancestor of the Israelite Prophets'
        ],
        lessons: [
            'Allah\'s power over natural laws',
            'His promises are always fulfilled',
            'Patience is rewarded'
        ],
        story: 'Ishaq (AS) was born to Ibrahim and Sarah in their old age, a miraculous gift from Allah. He was the father of Yaqub.',
        detailedHistory: [
            'Angels visiting Ibrahim gave good news of a son named Ishaq and grandson named Yaqub.',
            'Sarah, who was barren and old, laughed in amazement at this news.',
            'Allah reminded them that nothing is impossible for Him.',
            'Ishaq was born as promised and grew up righteous.',
            'He continued the prophetic mission in the land of Palestine.',
            'He married and had twin sons: Yaqub (Israel) and Esau.',
            'Through Yaqub came the twelve tribes of Israel and many prophets.'
        ]
    },
    {
        id: 10,
        name: 'Yaqub',
        arabicName: 'يعقوب',
        title: 'Israel',
        era: 'Son of Ishaq',
        location: 'Palestine, Egypt',
        mentionsInQuran: 16,
        keyEvents: [
            'Son of Ishaq, grandson of Ibrahim',
            'Also known as Israel',
            'Father of 12 sons including Yusuf',
            'Tested when Yusuf was taken from him',
            'Became blind from crying for Yusuf',
            'Reunited with Yusuf in Egypt',
            'Sight restored by Yusuf\'s shirt'
        ],
        lessons: [
            'Beautiful patience in hardship',
            'Trust in Allah\'s promise',
            'Family bonds in faith'
        ],
        story: 'Yaqub (AS), also called Israel, was severely tested when his beloved son Yusuf was taken. He showed beautiful patience until their reunion.',
        detailedHistory: [
            'Yaqub was the son of Ishaq and grandson of Ibrahim.',
            'He was also known as Israel, and his descendants are the Children of Israel.',
            'He had 12 sons, and Yusuf was his most beloved.',
            'When his sons claimed Yusuf was eaten by a wolf, he said "Beautiful patience."',
            'He cried so much that he became blind.',
            'Yet he never lost hope in Allah\'s mercy.',
            'Years later, when famine struck, his sons went to Egypt seeking grain.',
            'They discovered Yusuf had become the minister of Egypt.',
            'Yaqub sent Yusuf\'s shirt to be placed on his eyes, and his sight was restored.',
            'The family reunited in Egypt, and Yaqub lived there until his death.'
        ]
    },
    {
        id: 11,
        name: 'Yusuf',
        arabicName: 'يوسف',
        title: 'The Most Beautiful',
        era: 'Son of Yaqub',
        location: 'Palestine, Egypt',
        mentionsInQuran: 27,
        keyEvents: [
            'Given exceptional beauty',
            'Saw 11 stars, sun, moon prostrating to him',
            'Thrown into well by jealous brothers',
            'Sold as slave in Egypt',
            'Tested by Aziz\'s wife',
            'Imprisoned though innocent',
            'Interpreted Pharaoh\'s dream',
            'Became minister of Egypt',
            'Reunited with family'
        ],
        lessons: [
            'Patience through trials leads to success',
            'Chastity and moral integrity',
            'Forgiveness of those who wrong you',
            'Allah\'s plan is always best'
        ],
        story: 'Yusuf (AS) was given exceptional beauty. Betrayed by brothers, sold as slave, wrongly imprisoned—yet rose to become Egypt\'s minister through patience and faith.',
        detailedHistory: [
            'Yusuf was given half of all beauty, making him extremely handsome.',
            'As a child, he dreamt of 11 stars, the sun, and moon prostrating to him.',
            'His father Yaqub advised him not to tell his brothers, fearing their jealousy.',
            'The brothers plotted and threw him into a well, lying to Yaqub that a wolf ate him.',
            'A caravan found Yusuf and sold him as a slave in Egypt.',
            'The minister\'s (Aziz\'s) wife tried to seduce him, but he refused, saying he feared Allah.',
            'Though innocent, he was imprisoned when she accused him falsely.',
            'In prison, he correctly interpreted dreams for two prisoners.',
            'Years later, the King had a dream no one could interpret.',
            'Yusuf interpreted it: 7 years of plenty followed by 7 years of famine.',
            'He was freed and appointed minister to manage Egypt\'s resources.',
            'During famine, his brothers came seeking grain and did not recognize him.',
            'Yusuf eventually revealed himself and forgave them completely.',
            'The entire family including Yaqub moved to Egypt, where they prostrated to him—fulfilling his childhood dream.',
            'Surah Yusuf is called "the best of stories" in the Quran.'
        ]
    },
    {
        id: 12,
        name: 'Ayyub',
        arabicName: 'أيوب',
        title: 'The Patient',
        era: 'Descendant of Ibrahim',
        location: 'Land of Uz',
        mentionsInQuran: 4,
        keyEvents: [
            'Blessed with wealth, health, and family',
            'Lost everything in tests',
            'Suffered severe illness for years',
            'Never complained to others, only to Allah',
            'Called upon Allah after long patience',
            'Restored with double blessings'
        ],
        lessons: [
            'Patience in extreme hardship',
            'Gratitude in blessings and trials',
            'Allah rewards the patient'
        ],
        story: 'Ayyub (AS) had everything and lost it all—wealth, children, health. Despite years of suffering, he remained patient and was restored with double.',
        detailedHistory: [
            'Ayyub was a prosperous prophet with wealth, family, and good health.',
            'He was tested with the loss of his wealth, then his children, then his health.',
            'A severe skin disease afflicted him for 18 years according to some narrations.',
            'His wife stood by him, working to support them both.',
            'People abandoned him, but he never complained except to Allah.',
            'He would say: "Harm has touched me, and You are the Most Merciful."',
            'Allah commanded him to strike the ground with his foot—a spring gushed forth.',
            'He bathed and drank from it, and was completely healed.',
            'Allah restored his family and doubled his previous blessings.',
            'He is the ultimate example of patience (Sabr) in Islamic tradition.'
        ]
    },
    {
        id: 13,
        name: 'Shuayb',
        arabicName: 'شعيب',
        title: 'The Preacher of Prophets',
        era: 'After Lut',
        location: 'Madyan (Northwest Arabia)',
        mentionsInQuran: 11,
        keyEvents: [
            'Sent to people of Madyan',
            'Called against cheating in trade',
            'Warned against highway robbery',
            'People threatened to stone him',
            'Destroyed by earthquake and shading cloud'
        ],
        lessons: [
            'Honesty in business dealings',
            'Give full measure and weight',
            'Do not corrupt the earth'
        ],
        story: 'Shuayb (AS) was sent to Madyan, calling them to honest trade and worship. They refused and were destroyed by earthquake and fire.',
        detailedHistory: [
            'Shuayb was sent to the people of Madyan near the Gulf of Aqaba.',
            'They worshipped a grove and were notorious for cheating in trade.',
            'They would give less when selling and take more when buying.',
            'Shuayb preached honesty, fair dealing, and worship of Allah alone.',
            'He reminded them of the destruction of previous nations.',
            'They mocked him and threatened to expel him and his followers.',
            'Allah sent a shading cloud that they thought was relief from heat.',
            'Instead, it rained fire upon them accompanied by a mighty earthquake.',
            'Only Shuayb and the believers survived.',
            'Musa later married a daughter of Shuayb when he fled Egypt.'
        ]
    },
    {
        id: 14,
        name: 'Musa',
        arabicName: 'موسى',
        title: 'Kalimullah (The One Who Spoke to Allah)',
        era: 'Approximately 1400-1200 BCE',
        location: 'Egypt, Sinai, Near Jordan',
        mentionsInQuran: 136,
        keyEvents: [
            'Born during Pharaoh\'s killing of newborns',
            'Placed in the river, raised in Pharaoh\'s palace',
            'Fled Egypt after accidentally killing a man',
            'Received prophethood at burning bush',
            'Given 9 signs to confront Pharaoh',
            'Parted the Red Sea',
            'Received Torah on Mount Sinai',
            'Led Israelites for 40 years in wilderness'
        ],
        lessons: [
            'Allah protects His chosen ones',
            'Speaking truth to power',
            'Patience with ungrateful people',
            'Direct relationship with Allah'
        ],
        story: 'Musa (AS) is the most mentioned prophet in the Quran. Born when Pharaoh was killing newborns, he was raised in Pharaoh\'s palace, then became the liberator of Bani Israel.',
        detailedHistory: [
            'Pharaoh was killing all newborn boys of Bani Israel due to a prophecy.',
            'Allah inspired Musa\'s mother to place him in a basket in the river.',
            'Pharaoh\'s wife Asiya found him and convinced Pharaoh to adopt him.',
            'Musa\'s sister suggested his own mother as a wet nurse.',
            'He grew up in the palace with knowledge of his true identity.',
            'As a young man, he accidentally killed an Egyptian who was oppressing an Israelite.',
            'He fled to Madyan where he helped Shuayb\'s daughters and married one of them.',
            'After 10 years, while traveling back, he saw a fire on Mount Tur.',
            'Allah spoke to him directly and gave him the miracles of the staff and the glowing hand.',
            'With his brother Harun, he confronted Pharaoh and demanded freedom for Bani Israel.',
            'Allah sent 9 signs: the staff, the hand, flood, locusts, lice, frogs, blood, years of famine, and loss of fruits.',
            'Pharaoh\'s heart remained hard until Musa led Bani Israel out at night.',
            'Pharaoh\'s army pursued them to the sea.',
            'Allah commanded Musa to strike the sea, which parted into walls of water.',
            'Bani Israel crossed safely, but Pharaoh\'s army drowned.',
            'Musa received the Torah on Mount Sinai during 40 days of isolation.',
            'During his absence, the people worshipped a golden calf, which Musa destroyed.',
            'He led them in the wilderness for 40 years, during which Allah provided manna and quail.',
            'Allah spoke to him directly 4 times, giving him the title Kalimullah.'
        ]
    },
    {
        id: 15,
        name: 'Harun',
        arabicName: 'هارون',
        title: 'The Eloquent Minister',
        era: 'Brother of Musa',
        location: 'Egypt, Sinai',
        mentionsInQuran: 20,
        keyEvents: [
            'Elder brother of Musa',
            'Given prophethood along with Musa',
            'Known for eloquent speech',
            'Appointed as Musa\'s helper against Pharaoh',
            'Left in charge when Musa went to Sinai',
            'Opposed the golden calf worship'
        ],
        lessons: [
            'Supporting others in good work',
            'Eloquence in conveying truth',
            'Remaining faithful despite opposition'
        ],
        story: 'Harun (AS) was the eloquent brother of Musa, appointed as his helper in confronting Pharaoh and guiding Bani Israel.',
        detailedHistory: [
            'Harun was the elder brother of Musa, born during a year when boys were not being killed.',
            'He was known for his eloquent speech and gentle nature.',
            'When Allah sent Musa to Pharaoh, Musa asked for Harun as his helper.',
            'Allah granted this request and made Harun a prophet as well.',
            'Together they confronted Pharaoh and demanded freedom for Bani Israel.',
            'When Musa went to Mount Sinai for 40 days, Harun was left in charge.',
            'A man named Samiri made a golden calf, and many people worshipped it.',
            'Harun tried to stop them but was overpowered.',
            'Musa was initially angry with Harun but understood he had done his best.',
            'Harun died before entering the Promised Land.'
        ]
    },
    {
        id: 16,
        name: 'Dhul-Kifl',
        arabicName: 'ذو الكفل',
        title: 'The One of Double Portion',
        era: 'After Musa',
        location: 'Among Israelites',
        mentionsInQuran: 2,
        keyEvents: [
            'Known for truthfulness and patience',
            'Guaranteed paradise for fulfilling promises',
            'Met his obligations despite challenges',
            'Listed among the righteous in Quran'
        ],
        lessons: [
            'Keeping promises',
            'Patience in fulfilling responsibilities',
            'Steadfastness in faith'
        ],
        story: 'Dhul-Kifl (AS) is praised in the Quran for his patience and for being among the righteous, though his specific story is mainly known from narrations.',
        detailedHistory: [
            'Dhul-Kifl is mentioned twice in the Quran among the patient and righteous.',
            'His name means "the one of the portion" or "guarantee."',
            'Some scholars believe he was Ezekiel, while others say he was a righteous man made prophet.',
            'He is said to have guaranteed to fast daily, pray at night, and judge justly.',
            'Despite challenges, he fulfilled all his promises without fail.',
            'He is an example of one who undertakes religious duties and fulfills them completely.'
        ]
    },
    {
        id: 17,
        name: 'Dawud',
        arabicName: 'داود',
        title: 'The King-Prophet',
        era: 'Approximately 1000 BCE',
        location: 'Jerusalem, Israel',
        mentionsInQuran: 16,
        keyEvents: [
            'Killed Goliath (Jalut) as a young soldier',
            'Given kingship and prophethood',
            'Taught to make armor from iron',
            'Given the Zabur (Psalms)',
            'Mountains and birds praised Allah with him',
            'Known for fasting alternate days'
        ],
        lessons: [
            'Courage in facing evil',
            'Combining worldly work with worship',
            'Gratitude expressed through worship'
        ],
        story: 'Dawud (AS) killed the giant Jalut and was given both kingship and prophethood. Mountains and birds would praise Allah along with him.',
        detailedHistory: [
            'Dawud was from Bani Israel, known for his strength and righteousness.',
            'King Talut (Saul) led an army against the tyrant Jalut (Goliath) and his forces.',
            'Jalut was a giant warrior whom no Israelite could defeat.',
            'Young Dawud stepped forward and killed him with his sling.',
            'He was later given both kingship and prophethood—a rare combination.',
            'Allah softened iron for him, allowing him to make chain armor without fire.',
            'He was given the Zabur (Psalms), beautiful songs of praise to Allah.',
            'Mountains and birds would join him in glorifying Allah.',
            'His voice was so beautiful that birds would stop and listen.',
            'He fasted alternate days—the fast most beloved to Allah.',
            'He would pray one-third of the night, considered the best night prayer pattern.',
            'He was tested and always turned to Allah in repentance.'
        ]
    },
    {
        id: 18,
        name: 'Sulayman',
        arabicName: 'سليمان',
        title: 'The King of Jinn and Men',
        era: 'Son of Dawud, Approximately 970-930 BCE',
        location: 'Jerusalem',
        mentionsInQuran: 17,
        keyEvents: [
            'Inherited prophethood and kingdom from Dawud',
            'Given control over wind, jinn, and animals',
            'Could understand language of birds and ants',
            'Built magnificent temple with jinn laborers',
            'Story with Queen of Sheba (Bilqis)',
            'Died leaning on his staff, jinn unaware'
        ],
        lessons: [
            'Great power requires great gratitude',
            'Using blessings for good',
            'Wisdom in leadership'
        ],
        story: 'Sulayman (AS) was given a kingdom like no other—control over jinn, wind, and animals. He could understand birds and ants, and Queen Bilqis accepted Islam through him.',
        detailedHistory: [
            'Sulayman inherited both kingdom and prophethood from his father Dawud.',
            'He prayed for a kingdom that no one after him would have—Allah granted it.',
            'He could command the wind to travel a month\'s journey in one direction.',
            'Jinn were made subservient to him, building structures and diving for treasures.',
            'He could understand the languages of birds and ants.',
            'Once, an ant warned her colony to enter their homes lest Sulayman\'s army crush them unknowingly.',
            'Sulayman smiled and thanked Allah for this blessing.',
            'The hoopoe bird brought news of the Queen of Sheba (Bilqis) who worshipped the sun.',
            'Sulayman sent her a letter inviting her to Islam.',
            'Her throne was transported to him miraculously before she arrived.',
            'When she saw it, she recognized Allah\'s power and accepted Islam.',
            'Sulayman died while leaning on his staff, and the jinn continued working, unaware.',
            'Only when a termite ate through the staff did his body fall, revealing Allah\'s knowledge alone.'
        ]
    },
    {
        id: 19,
        name: 'Ilyas',
        arabicName: 'إلياس',
        title: 'Prophet Against Baal',
        era: 'After Sulayman',
        location: 'Northern Israel',
        mentionsInQuran: 2,
        keyEvents: [
            'Sent to people worshipping Baal (an idol)',
            'Called them to worship Allah alone',
            'Majority rejected his message',
            'Known for his asceticism and piety',
            'Listed among the righteous in Quran'
        ],
        lessons: [
            'Standing against popular falsehood',
            'Perseverance in calling to truth'
        ],
        story: 'Ilyas (AS) was sent to call his people away from Baal worship. Though rejected by most, he is praised in the Quran among the righteous.',
        detailedHistory: [
            'Ilyas was sent to the people of Baalbek in modern Lebanon.',
            'They had abandoned Allah and worshipped an idol called Baal.',
            'He called them to abandon this and worship Allah alone.',
            'Most rejected him and threatened him.',
            'He continued his mission with patience and determination.',
            'The Quran praises him highly: "Peace be upon Ilyasin" (37:130).',
            'He is identified with Elijah of Biblical tradition.'
        ]
    },
    {
        id: 20,
        name: 'Alyasa',
        arabicName: 'اليسع',
        title: 'The Successor of Ilyas',
        era: 'After Ilyas',
        location: 'Israel',
        mentionsInQuran: 2,
        keyEvents: [
            'Appointed as prophet after Ilyas',
            'Continued the message of monotheism',
            'Called people to worship Allah alone',
            'Mentioned among the excellent in Quran'
        ],
        lessons: [
            'Continuing good work of predecessors',
            'Perseverance in truth'
        ],
        story: 'Alyasa (AS) succeeded Ilyas in calling people to Allah. The Quran mentions him among those preferred above all others.',
        detailedHistory: [
            'Alyasa was a successor to Ilyas in prophethood.',
            'He continued calling people to worship Allah alone.',
            'The Quran mentions him along with Zakariya, Yahya, and Isa as among the righteous.',
            'He is identified with Elisha of Biblical tradition.',
            'Details of his life are mainly known from historical narrations.'
        ]
    },
    {
        id: 21,
        name: 'Yunus',
        arabicName: 'يونس',
        title: 'The One in the Whale',
        era: 'Before or around time of Israelite prophets',
        location: 'Nineveh (Iraq)',
        mentionsInQuran: 4,
        keyEvents: [
            'Sent to people of Nineveh',
            'Left in anger before Allah\'s command',
            'Boarded a ship that nearly sank',
            'Swallowed by a whale',
            'Made dua of repentance inside the whale',
            'Released and his people accepted Islam'
        ],
        lessons: [
            'Never despair of Allah\'s mercy',
            'Patience is required in calling to Islam',
            'Power of sincere repentance'
        ],
        story: 'Yunus (AS) left his people in frustration, was swallowed by a whale, repented inside its belly, and was saved. His people became believers.',
        detailedHistory: [
            'Yunus was sent to the city of Nineveh (in modern Iraq).',
            'He called them to abandon idol worship, but they rejected him.',
            'After long efforts, he left in anger without Allah\'s permission.',
            'He boarded a ship, but a storm threatened to sink it.',
            'Lots were drawn to lighten the load, and his name came up three times.',
            'He was thrown overboard and swallowed by a whale.',
            'Inside the whale\'s belly, he heard creatures praising Allah.',
            'He made the famous dua: "There is no god but You, Glory be to You, I was among the wrongdoers."',
            'Allah commanded the whale to release him on shore.',
            'He was weak and Allah grew a gourd plant to shade him.',
            'Meanwhile, his people of Nineveh repented and became believers—unique among nations.',
            'Yunus is also called Dhun-Nun (The One of the Whale).'
        ]
    },
    {
        id: 22,
        name: 'Zakariya',
        arabicName: 'زكريا',
        title: 'Guardian of Maryam',
        era: 'Shortly before Isa',
        location: 'Jerusalem',
        mentionsInQuran: 7,
        keyEvents: [
            'Served in the temple in Jerusalem',
            'Guardian of Maryam (mother of Isa)',
            'Witnessed miracles for Maryam',
            'Prayed for a son in old age',
            'Given Yahya as a son',
            'Struck mute for 3 days as a sign'
        ],
        lessons: [
            'Never too old to ask from Allah',
            'Allah answers sincere prayers',
            'Hope in Allah\'s mercy'
        ],
        story: 'Zakariya (AS) was the guardian of Maryam and witnessed her provision from Allah. In old age, he prayed for a son and was blessed with Yahya.',
        detailedHistory: [
            'Zakariya was a priest serving in the temple of Jerusalem.',
            'He was appointed guardian of Maryam after lots were drawn.',
            'Whenever he visited her chamber, he found provision she had not acquired.',
            'She told him it was from Allah—this inspired him to pray for a child.',
            'He prayed secretly, mentioning his old age and his wife\'s barrenness.',
            'Angels announced the birth of Yahya—a name never given before.',
            'As a sign, he was made unable to speak for three days except through gestures.',
            'He indicated to his people to glorify Allah morning and evening.',
            'According to some narrations, he was martyred by his people.'
        ]
    },
    {
        id: 23,
        name: 'Yahya',
        arabicName: 'يحيى',
        title: 'The First of His Name',
        era: 'Shortly before Isa',
        location: 'Jerusalem',
        mentionsInQuran: 5,
        keyEvents: [
            'Born to Zakariya and Elizabeth in old age',
            'Given wisdom as a child',
            'First to be called by this name',
            'Called people to repentance',
            'Contemporary of Isa (Jesus)',
            'Martyred for speaking truth'
        ],
        lessons: [
            'Speaking truth regardless of consequences',
            'Maintaining chastity and purity',
            'Devotion from young age'
        ],
        story: 'Yahya (AS) was given wisdom as a child and called people to repentance. He was known as John the Baptist and was martyred for speaking the truth.',
        detailedHistory: [
            'Yahya was born miraculously to Zakariya and his elderly wife.',
            'Allah gave him a unique name never used before.',
            'He was given wisdom (hukm) while still young.',
            'He was kind to his parents, not arrogant or disobedient.',
            'He lived a simple, ascetic life devoted to worship.',
            'He was chaste and pure, never approaching what was forbidden.',
            'He called people to righteousness and confirmed the coming of Isa.',
            'He was martyred by the ruler for speaking against his unlawful marriage.',
            'The Quran sends peace upon him on the day of his birth, death, and resurrection.'
        ]
    },
    {
        id: 24,
        name: 'Isa',
        arabicName: 'عيسى',
        title: 'The Messiah (Al-Masih)',
        era: 'Approximately 1-33 CE',
        location: 'Palestine',
        mentionsInQuran: 25,
        keyEvents: [
            'Born miraculously to virgin Maryam',
            'Spoke in the cradle defending his mother',
            'Given the Injil (Gospel)',
            'Performed miracles: healing blind, lepers, raising dead',
            'Created bird from clay by Allah\'s permission',
            'Disciples became his helpers',
            'Not crucified—raised to heaven alive',
            'Will return before Day of Judgment'
        ],
        lessons: [
            'Allah\'s power to create without father',
            'Miracles are by Allah\'s permission',
            'He was a messenger, not divine'
        ],
        story: 'Isa (AS) was born miraculously to Maryam without a father. He spoke in the cradle, performed miracles, and was raised to heaven—he will return before the end times.',
        detailedHistory: [
            'Maryam was devoted to worship from childhood, living in the temple.',
            'Angel Jibreel appeared to her as a man to announce a pure son.',
            'She conceived miraculously without any man touching her.',
            'She withdrew to a remote place to give birth.',
            'Under a palm tree in labor pain, she wished she had died.',
            'A voice told her to shake the tree for dates and drink from a stream.',
            'She returned with the baby, and people accused her of immorality.',
            'Baby Isa spoke: "I am a servant of Allah. He has given me the Book and made me a prophet."',
            'As he grew, he called Bani Israel to worship Allah and follow the Torah.',
            'He was given the Injil (Gospel) as guidance.',
            'He performed miracles by Allah\'s permission: healing the blind and lepers, raising the dead.',
            'He made a bird from clay and breathed into it—it flew by Allah\'s permission.',
            'He had disciples (Hawariyyun) who supported his mission.',
            'The Jewish leaders plotted to kill him.',
            'Allah raised him to heaven alive—he was not crucified or killed.',
            'Someone was made to resemble him and was crucified instead.',
            'Isa is alive in heaven and will return before the Day of Judgment.',
            'He will descend, break the cross, kill the swine, and establish justice.',
            'He will pray behind the Muslim leader and live as a just ruler before dying naturally.'
        ]
    },
    {
        id: 25,
        name: 'Muhammad',
        arabicName: 'محمد ﷺ',
        title: 'The Seal of Prophets',
        era: '570-632 CE',
        location: 'Makkah, Madinah',
        mentionsInQuran: 4,
        keyEvents: [
            'Born in Year of the Elephant (570 CE)',
            'Orphaned early, raised by grandfather then uncle',
            'Known as Al-Amin (The Trustworthy)',
            'Received first revelation at age 40',
            'Preached in Makkah for 13 years',
            'Migrated to Madinah (Hijrah)',
            'Established first Islamic state',
            'Conquered Makkah peacefully',
            'Delivered Farewell Sermon',
            'Passed away in 632 CE'
        ],
        lessons: [
            'Perfect example for humanity',
            'Mercy to all worlds',
            'Balance between spiritual and worldly life',
            'Justice, forgiveness, and compassion'
        ],
        story: 'Muhammad ﷺ is the final messenger, sent as a mercy to all worlds. He received the Quran over 23 years and established Islam as a complete way of life.',
        detailedHistory: [
            'Born in Makkah in the Year of the Elephant (570 CE).',
            'His father Abdullah died before his birth, mother Aminah when he was 6.',
            'Raised by grandfather Abdul-Muttalib, then uncle Abu Talib.',
            'Known as As-Sadiq Al-Amin (The Truthful, The Trustworthy).',
            'Married Khadijah at age 25; she was his greatest supporter.',
            'Used to meditate in Cave Hira; received first revelation at age 40.',
            'Angel Jibreel commanded him to read, and Surah Al-Alaq was revealed.',
            'Preached secretly for 3 years, then publicly in Makkah.',
            'Faced severe persecution from Quraysh for 13 years.',
            'Lost Khadijah and Abu Talib in the Year of Sorrow.',
            'Experienced Isra and Mi\'raj—night journey to Jerusalem and ascension to heavens.',
            'Migrated to Madinah in 622 CE, marking start of Islamic calendar.',
            'Built first mosque and established the Islamic state.',
            'Fought defensive battles: Badr, Uhud, Khandaq, and others.',
            'Signed Treaty of Hudaybiyyah, leading to peaceful spread of Islam.',
            'Conquered Makkah in 630 CE without bloodshed, forgiving his enemies.',
            'Performed Farewell Hajj and delivered the Farewell Sermon.',
            'Passed away on 12 Rabi al-Awwal 11 AH (632 CE) in Aisha\'s arms.',
            'Buried in his room, now part of Al-Masjid an-Nabawi in Madinah.',
            'He is the seal of all prophets—no prophet will come after him.'
        ]
    }
];

export default function ProphetsPage() {
    const [expandedId, setExpandedId] = React.useState<number | null>(null);
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredProphets = PROPHETS.filter(prophet =>
        prophet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prophet.arabicName.includes(searchQuery) ||
        prophet.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen py-20 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                        <Users className="w-8 h-8 text-[var(--color-primary)]" />
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] mb-4">
                        Stories of the Prophets
                    </h1>
                    <p className="text-2xl font-arabic text-[var(--color-primary)]" dir="rtl">
                        قصص الأنبياء
                    </p>
                    <p className="text-[var(--color-text-secondary)] mt-4 max-w-2xl mx-auto">
                        Learn from the lives, struggles, and lessons of all 25 prophets mentioned in the Quran
                    </p>
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search prophets..."
                        className="input-premium w-full"
                    />
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="grid grid-cols-3 gap-4 mb-8"
                >
                    <div className="card-premium p-4 text-center">
                        <p className="text-2xl font-bold text-[var(--color-primary)]">25</p>
                        <p className="text-xs text-[var(--color-text-muted)]">Prophets in Quran</p>
                    </div>
                    <div className="card-premium p-4 text-center">
                        <p className="text-2xl font-bold text-[var(--color-text)]">124,000</p>
                        <p className="text-xs text-[var(--color-text-muted)]">Total Prophets (tradition)</p>
                    </div>
                    <div className="card-premium p-4 text-center">
                        <p className="text-2xl font-bold text-[var(--color-accent)]">5</p>
                        <p className="text-xs text-[var(--color-text-muted)]">Ulul Azm</p>
                    </div>
                </motion.div>

                {/* Prophets List */}
                <div className="space-y-4">
                    {filteredProphets.map((prophet, index) => (
                        <motion.div
                            key={prophet.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.02 }}
                            className="card-premium overflow-hidden"
                        >
                            {/* Header */}
                            <button
                                onClick={() => setExpandedId(expandedId === prophet.id ? null : prophet.id)}
                                className="w-full p-6 flex items-center gap-4 text-left"
                            >
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xl font-bold text-[var(--color-primary)]">{prophet.id}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-serif text-xl text-[var(--color-text)]">{prophet.name}</h3>
                                        <span className="font-arabic text-lg text-[var(--color-primary)]">{prophet.arabicName}</span>
                                    </div>
                                    <p className="text-sm text-[var(--color-text-muted)]">{prophet.title}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-medium text-[var(--color-text)]">{prophet.mentionsInQuran}</p>
                                        <p className="text-xs text-[var(--color-text-muted)]">mentions</p>
                                    </div>
                                    {expandedId === prophet.id ? (
                                        <ChevronUp className="w-5 h-5 text-[var(--color-text-muted)]" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />
                                    )}
                                </div>
                            </button>

                            {/* Expanded Content */}
                            <AnimatePresence>
                                {expandedId === prophet.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 space-y-6">
                                            {/* Quick Info */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                                                    <div>
                                                        <p className="text-xs text-[var(--color-text-muted)]">Era</p>
                                                        <p className="text-sm text-[var(--color-text)]">{prophet.era}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                                                    <div>
                                                        <p className="text-xs text-[var(--color-text-muted)]">Location</p>
                                                        <p className="text-sm text-[var(--color-text)]">{prophet.location}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
                                                    <div>
                                                        <p className="text-xs text-[var(--color-text-muted)]">In Quran</p>
                                                        <p className="text-sm text-[var(--color-text)]">{prophet.mentionsInQuran} times</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Star className="w-4 h-4 text-[var(--color-accent)]" />
                                                    <div>
                                                        <p className="text-xs text-[var(--color-text-muted)]">Events</p>
                                                        <p className="text-sm text-[var(--color-text)]">{prophet.keyEvents.length} key</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Summary */}
                                            <div className="p-4 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10">
                                                <p className="text-[var(--color-text-secondary)] leading-relaxed">{prophet.story}</p>
                                            </div>

                                            {/* Key Events */}
                                            <div>
                                                <h4 className="font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
                                                    <Scroll className="w-4 h-4 text-[var(--color-primary)]" />
                                                    Key Events
                                                </h4>
                                                <ul className="space-y-2">
                                                    {prophet.keyEvents.map((event, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                                                            <span className="text-[var(--color-primary)] mt-1">•</span>
                                                            {event}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Detailed History */}
                                            <div>
                                                <h4 className="font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
                                                    Detailed History
                                                </h4>
                                                <div className="space-y-3">
                                                    {prophet.detailedHistory.map((paragraph, i) => (
                                                        <p key={i} className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                                                            {paragraph}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Lessons */}
                                            <div>
                                                <h4 className="font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
                                                    <Heart className="w-4 h-4 text-[var(--color-accent)]" />
                                                    Lessons
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {prophet.lessons.map((lesson, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-3 py-1.5 rounded-full text-sm bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] dark:text-[var(--color-accent)]"
                                                        >
                                                            {lesson}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {filteredProphets.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-[var(--color-text-muted)]">No prophets found matching &quot;{searchQuery}&quot;</p>
                    </div>
                )}
            </div>
        </div>
    );
}
