SET NOCOUNT ON;

BEGIN TRAN;

DECLARE @quiz1_id int, @quiz2_id int, @quiz3_id int;

-- === QUIZZES ===
INSERT INTO dbo.Quizzes (user_id, username, title, description, visibility)
VALUES (1, 'AdminUser', 'Middle School ELA Trivia - Vocabulary & Usage', 'Challenging vocabulary and word usage quiz for middle school students.', 'public');
SET @quiz1_id = SCOPE_IDENTITY();

INSERT INTO dbo.Quizzes (user_id, username, title, description, visibility)
VALUES (1, 'AdminUser', 'Middle School ELA Trivia - Literature & Authors', 'Test knowledge of classic and modern literature, authors, and genres.', 'public');
SET @quiz2_id = SCOPE_IDENTITY();

INSERT INTO dbo.Quizzes (user_id, username, title, description, visibility)
VALUES (1, 'AdminUser', 'Middle School ELA Trivia - Grammar & Writing', 'Quiz on grammar rules, sentence structure, and writing skills.', 'public');
SET @quiz3_id = SCOPE_IDENTITY();

-- === QUESTIONS FOR QUIZ 1 (Vocabulary & Usage) ===
INSERT INTO dbo.Questions (quiz_id, question, options, correct) VALUES
(@quiz1_id, 'What is the meaning of the word "meticulous"?', '["Careful and precise","Lacking detail","Careless","Quick and hasty"]', 'Careful and precise'),
(@quiz1_id, 'Choose the best synonym for "elated".', '["Sad","Joyful","Confused","Angry"]', 'Joyful'),
(@quiz1_id, 'What does "benevolent" most nearly mean?', '["Kind and generous","Harmful","Neutral","Selfish"]', 'Kind and generous'),
(@quiz1_id, 'Select the antonym of "scarce".', '["Abundant","Rare","Minimal","Limited"]', 'Abundant'),
(@quiz1_id, 'Which word means "to improve or make better"?', '["Deteriorate","Enhance","Reduce","Harm"]', 'Enhance'),
(@quiz1_id, 'What is the meaning of "candid"?', '["Honest and direct","Secretive","Confused","Hidden"]', 'Honest and direct'),
(@quiz1_id, 'Choose the best synonym for "arduous".', '["Easy","Exhausting","Quick","Simple"]', 'Exhausting'),
(@quiz1_id, 'What does "pragmatic" most nearly mean?', '["Practical","Theoretical","Imaginary","Naive"]', 'Practical'),
(@quiz1_id, 'Select the antonym of "vivid".', '["Bright","Dull","Colorful","Clear"]', 'Dull'),
(@quiz1_id, 'Which word means "to strongly criticize"?', '["Praise","Commend","Condemn","Approve"]', 'Condemn'),
(@quiz1_id, 'What is the meaning of "incessant"?', '["Occasional","Constant","Brief","Rare"]', 'Constant'),
(@quiz1_id, 'Choose the best synonym for "serene".', '["Calm","Chaotic","Loud","Restless"]', 'Calm'),
(@quiz1_id, 'What does "eccentric" most nearly mean?', '["Unusual","Common","Normal","Conventional"]', 'Unusual'),
(@quiz1_id, 'Select the antonym of "reluctant".', '["Willing","Hesitant","Unsure","Afraid"]', 'Willing'),
(@quiz1_id, 'Which word means "to make something less severe"?', '["Intensify","Alleviate","Aggravate","Increase"]', 'Alleviate'),
(@quiz1_id, 'What is the meaning of "ambiguous"?', '["Clear","Uncertain","Simple","Obvious"]', 'Uncertain'),
(@quiz1_id, 'Choose the best synonym for "ephemeral".', '["Lasting","Temporary","Enduring","Infinite"]', 'Temporary'),
(@quiz1_id, 'What does "gregarious" most nearly mean?', '["Sociable","Shy","Reserved","Quiet"]', 'Sociable'),
(@quiz1_id, 'Select the antonym of "transparent".', '["Clear","Opaque","Open","Obvious"]', 'Opaque'),
(@quiz1_id, 'Which word means "to examine carefully"?', '["Neglect","Ignore","Overlook","Scrutinize"]', 'Scrutinize'),
(@quiz1_id, 'What is the meaning of "melancholy"?', '["Happiness","Sadness","Excitement","Anger"]', 'Sadness'),
(@quiz1_id, 'Choose the best synonym for "resilient".', '["Weak","Flexible","Fragile","Brittle"]', 'Flexible'),
(@quiz1_id, 'What does "austere" most nearly mean?', '["Severe","Playful","Generous","Luxurious"]', 'Severe'),
(@quiz1_id, 'Select the antonym of "expand".', '["Increase","Contract","Stretch","Enlarge"]', 'Contract'),
(@quiz1_id, 'Which word means "to give in or surrender"?', '["Resist","Defy","Capitulate","Fight"]', 'Capitulate'),
(@quiz1_id, 'What is the meaning of "precocious"?', '["Slow to learn","Exceptionally early in development","Average","Immature"]', 'Exceptionally early in development'),
(@quiz1_id, 'Choose the best synonym for "reverent".', '["Respectful","Disrespectful","Rude","Casual"]', 'Respectful'),
(@quiz1_id, 'What does "novel" most nearly mean?', '["Old","New","Common","Familiar"]', 'New'),
(@quiz1_id, 'Select the antonym of "hostile".', '["Friendly","Aggressive","Unfriendly","Defensive"]', 'Friendly'),
(@quiz1_id, 'Which word means "to avoid or keep away from"?', '["Pursue","Seek","Confront","Evade"]', 'Evade');

-- === QUESTIONS FOR QUIZ 2 (Literature & Authors) ===
INSERT INTO dbo.Questions (quiz_id, question, options, correct) VALUES
(@quiz2_id, 'Who wrote "The Adventures of Tom Sawyer"?', '["Mark Twain","Charles Dickens","Louisa May Alcott","Robert Louis Stevenson"]', 'Mark Twain'),
(@quiz2_id, 'Which Shakespeare play features the characters Rosencrantz and Guildenstern?', '["Hamlet","Macbeth","Othello","King Lear"]', 'Hamlet'),
(@quiz2_id, 'In "Charlotte’s Web", what type of animal is Charlotte?', '["Pig","Spider","Cow","Horse"]', 'Spider'),
(@quiz2_id, 'Who is the author of "The Giver"?', '["Lois Lowry","J.K. Rowling","Suzanne Collins","Madeleine L’Engle"]', 'Lois Lowry'),
(@quiz2_id, 'Which novel begins with "Call me Ishmael"?', '["Moby-Dick","The Old Man and the Sea","Treasure Island","Gulliver’s Travels"]', 'Moby-Dick'),
(@quiz2_id, 'Who wrote "Pride and Prejudice"?', '["Jane Austen","Emily Brontë","Charlotte Brontë","Mary Shelley"]', 'Jane Austen'),
(@quiz2_id, 'Which famous poet wrote "The Raven"?', '["Edgar Allan Poe","Robert Frost","Emily Dickinson","Walt Whitman"]', 'Edgar Allan Poe'),
(@quiz2_id, 'What is the name of the young boy in "The Lion, the Witch and the Wardrobe"?', '["Peter","Edmund","Lucy","Caspian"]', 'Edmund'),
(@quiz2_id, 'Who is the main character in "Holes" by Louis Sachar?', '["Stanley Yelnats","Zero","Hector Zeroni","Mr. Sir"]', 'Stanley Yelnats'),
(@quiz2_id, 'Which Greek poet is credited with writing "The Odyssey"?', '["Homer","Sophocles","Euripides","Aristophanes"]', 'Homer'),
(@quiz2_id, 'In "Anne of Green Gables", what is Anne’s last name?', '["Shirley","Green","Gables","Smith"]', 'Shirley'),
(@quiz2_id, 'Who wrote "The Hobbit"?', '["J.R.R. Tolkien","C.S. Lewis","Philip Pullman","George R.R. Martin"]', 'J.R.R. Tolkien'),
(@quiz2_id, 'Which author created the detective Sherlock Holmes?', '["Arthur Conan Doyle","Agatha Christie","Raymond Chandler","Dashiell Hammett"]', 'Arthur Conan Doyle'),
(@quiz2_id, 'What is the first book in the "Harry Potter" series?', '["The Chamber of Secrets","The Sorcerer’s Stone","The Goblet of Fire","The Prisoner of Azkaban"]', 'The Sorcerer’s Stone'),
(@quiz2_id, 'In "The Outsiders", what is Ponyboy’s last name?', '["Curtis","Smith","Jones","Roberts"]', 'Curtis'),
(@quiz2_id, 'Who is the author of "Matilda"?', '["Roald Dahl","Beatrix Potter","Dr. Seuss","E.B. White"]', 'Roald Dahl'),
(@quiz2_id, 'Which Shakespeare play features the line "A rose by any other name would smell as sweet"?', '["Romeo and Juliet","Much Ado About Nothing","Twelfth Night","The Tempest"]', 'Romeo and Juliet'),
(@quiz2_id, 'In "To Kill a Mockingbird", who is Scout’s father?', '["Atticus Finch","Tom Robinson","Boo Radley","Jem Finch"]', 'Atticus Finch'),
(@quiz2_id, 'Who wrote "Little Women"?', '["Louisa May Alcott","Frances Hodgson Burnett","Lucy Maud Montgomery","Kate DiCamillo"]', 'Louisa May Alcott'),
(@quiz2_id, 'What is the name of the wizard in "The Sword in the Stone"?', '["Merlin","Gandalf","Dumbledore","Saruman"]', 'Merlin'),
(@quiz2_id, 'Which classic novel features the character Pip?', '["Great Expectations","Oliver Twist","A Tale of Two Cities","David Copperfield"]', 'Great Expectations'),
(@quiz2_id, 'Who is the author of "A Wrinkle in Time"?', '["Madeleine L’Engle","Judy Blume","Katherine Paterson","Lois Lowry"]', 'Madeleine L’Engle'),
(@quiz2_id, 'Which novel is set in the fictional town of Maycomb, Alabama?', '["To Kill a Mockingbird","The Secret Garden","The Catcher in the Rye","Of Mice and Men"]', 'To Kill a Mockingbird'),
(@quiz2_id, 'What is the main animal character in "Watership Down"?', '["Rabbit","Fox","Horse","Badger"]', 'Rabbit'),
(@quiz2_id, 'Who wrote the play "A Midsummer Night’s Dream"?', '["William Shakespeare","Christopher Marlowe","Ben Jonson","John Webster"]', 'William Shakespeare'),
(@quiz2_id, 'In "The Secret Garden", what is the girl’s name?', '["Mary Lennox","Sara Crewe","Lucy Pevensie","Anne Shirley"]', 'Mary Lennox'),
(@quiz2_id, 'Who wrote "Treasure Island"?', '["Robert Louis Stevenson","Herman Melville","Daniel Defoe","Jonathan Swift"]', 'Robert Louis Stevenson'),
(@quiz2_id, 'Which author created Winnie-the-Pooh?', '["A.A. Milne","Beatrix Potter","Dr. Seuss","Roald Dahl"]', 'A.A. Milne'),
(@quiz2_id, 'In "Percy Jackson and the Olympians", who is Percy’s father?', '["Poseidon","Zeus","Hades","Apollo"]', 'Poseidon'),
(@quiz2_id, 'Which book begins with "It was the best of times, it was the worst of times"?', '["A Tale of Two Cities","Great Expectations","Oliver Twist","Les Misérables"]', 'A Tale of Two Cities');

-- === QUESTIONS FOR QUIZ 3 (Grammar & Writing) ===
INSERT INTO dbo.Questions (quiz_id, question, options, correct) VALUES
(@quiz3_id, 'Which sentence is punctuated correctly?', '["I like apples bananas and grapes.","I like apples, bananas, and grapes.","I like apples bananas, and grapes.","I like apples bananas, and, grapes."]', 'I like apples, bananas, and grapes.'),
(@quiz3_id, 'Identify the subject in the sentence: "The tall boy ran quickly."', '["tall boy","boy","quickly","ran"]', 'boy'),
(@quiz3_id, 'Which word is an adverb?', '["run","quickly","blue","table"]', 'quickly'),
(@quiz3_id, 'Choose the correct form: "She has ____ the book to the library."', '["bring","brought","brang","brung"]', 'brought'),
(@quiz3_id, 'Which is a compound sentence?', '["I ran to the store.","I ran to the store, and I bought milk.","Running to the store.","Because I ran to the store."]', 'I ran to the store, and I bought milk.'),
(@quiz3_id, 'Select the sentence with correct subject-verb agreement.', '["The dogs barks loudly.","The dogs bark loudly.","The dog bark loudly.","The dog bark."]', 'The dogs bark loudly.'),
(@quiz3_id, 'Which word is a conjunction?', '["and","run","blue","happily"]', 'and'),
(@quiz3_id, 'Choose the correct possessive form: The ____ toys are on the floor.', '["childs","child''s","childs''","children"]', 'child''s'),
(@quiz3_id, 'Which sentence is in passive voice?', '["The cake was eaten by the children.","The children ate the cake.","The children are eating cake.","The children eat cake."]', 'The cake was eaten by the children.'),
(@quiz3_id, 'Identify the preposition: "The cat is under the table."', '["cat","is","under","table"]', 'under'),
(@quiz3_id, 'Which is an example of a metaphor?', '["Her smile was sunshine.","Her smile was like sunshine.","Her smile shone like sunshine.","Her smile is as bright as the sun."]', 'Her smile was sunshine.'),
(@quiz3_id, 'Select the sentence without a fragment.', '["Because I said so.","Walking through the park.","I went to the store.","When the bell rings."]', 'I went to the store.'),
(@quiz3_id, 'Which is the correct plural form of "tomato"?', '["tomatos","tomatoes","tomatoe","tomato''s"]', 'tomatoes'),
(@quiz3_id, 'Choose the correct homophone: "I can’t wait to ____ my new friend."', '["meat","meet","mete","mete''"]', 'meet'),
(@quiz3_id, 'Identify the direct object: "She threw the ball."', '["She","threw","ball","the"]', 'ball'),
(@quiz3_id, 'Which sentence uses a semicolon correctly?', '["I have a big test tomorrow; I can’t go out tonight.","I have a big test tomorrow; and I can’t go out tonight.","I have a big test; tomorrow I can’t go out tonight.","I have; a big test tomorrow I can’t go out tonight."]', 'I have a big test tomorrow; I can’t go out tonight.'),
(@quiz3_id, 'Which is the correct past tense of "swim"?', '["swam","swum","swimed","swamned"]', 'swam'),
(@quiz3_id, 'Choose the correctly capitalized title.', '["the lord of the rings","The Lord Of The Rings","The Lord of the Rings","The lord of the Rings"]', 'The Lord of the Rings'),
(@quiz3_id, 'Identify the predicate: "The small dog barked loudly."', '["The small dog","barked loudly","small dog","dog"]', 'barked loudly'),
(@quiz3_id, 'Which is the correct comparative form?', '["more fun","funner","funest","most fun"]', 'more fun'),
(@quiz3_id, 'Select the correctly spelled word.', '["definately","definitely","definetely","definitley"]', 'definitely'),
(@quiz3_id, 'Which sentence contains an appositive?', '["My brother, a great cook, made dinner.","My brother made dinner.","A great cook made dinner.","Dinner was made by my brother."]', 'My brother, a great cook, made dinner.'),
(@quiz3_id, 'Choose the correct punctuation: "Wow that’s amazing"', '["Wow, that’s amazing.","Wow that’s amazing.","Wow that’s amazing!","Wow. That’s amazing."]', 'Wow, that’s amazing.'),
(@quiz3_id, 'Which is an example of personification?', '["The wind whispered through the trees.","The wind is fast.","The wind is strong.","The wind blows."]', 'The wind whispered through the trees.'),
(@quiz3_id, 'Identify the clause type: "When I arrived."', '["Independent","Dependent","Main","Complete"]', 'Dependent'),
(@quiz3_id, 'Choose the correct verb form: "Neither of the boys ____ going."', '["is","are","were","be"]', 'is'),
(@quiz3_id, 'Which sentence is written in the future perfect tense?', '["I will have finished my homework by 8 PM.","I finish my homework by 8 PM.","I will finish my homework by 8 PM.","I am finishing my homework by 8 PM."]', 'I will have finished my homework by 8 PM.'),
(@quiz3_id, 'Select the correct plural possessive form: The ____ shoes are new.', '["boys","boy''s","boys''","boy"]', 'boys'''),
(@quiz3_id, 'Which is a complex sentence?', '["Although it was raining, we went outside.","It was raining, we went outside.","It was raining.","We went outside."]', 'Although it was raining, we went outside.');

COMMIT TRAN;
