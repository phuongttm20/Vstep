export interface RelativePronounRow {
  word: string;
  usedFor: string;
  role: string;
  exampleEn: string;
  exampleVi: string;
  tip: string;
}

export interface SentenceCombineDemo {
  id: string;
  title: string;
  sentence1: string;
  sentence2: string;
  repeatedTarget: string;
  pronoun: string;
  combinedSentence: string;
  translationVi: string;
  stepExplanation: string;
}

export interface RelativeExercise {
  id: string;
  type: 'choice' | 'fill';
  question: string;
  hint?: string;
  options?: string[];
  answer: string;
  acceptableAnswers?: string[];
  explanationVi: string;
}

export const RELATIVE_PRONOUNS: RelativePronounRow[] = [
  {
    word: 'WHO',
    usedFor: 'Chỉ NGƯỜI',
    role: 'Làm Chủ ngữ (S) hoặc Tân ngữ (O)',
    exampleEn: 'The girl who is wearing a red dress is my sister.',
    exampleVi: 'Cô gái người mà đang mặc váy đỏ là em gái tôi.',
    tip: 'Sau WHO thường là một Động từ (who + V) hoặc Chủ ngữ + Động từ.',
  },
  {
    word: 'WHOM',
    usedFor: 'Chỉ NGƯỜI',
    role: 'Chỉ làm Tân ngữ (O)',
    exampleEn: 'The man whom we met yesterday is a doctor.',
    exampleVi: 'Người đàn ông mà chúng tôi đã gặp hôm qua là một bác sĩ.',
    tip: 'Sau WHOM bắt buộc phải có một Chủ ngữ mới (S + V). Không dùng WHOM + Động từ.',
  },
  {
    word: 'WHICH',
    usedFor: 'Chỉ VẬT / SỰ VIỆC',
    role: 'Làm Chủ ngữ (S) hoặc Tân ngữ (O)',
    exampleEn: 'The book which you lent me is very interesting.',
    exampleVi: 'Cuốn sách mà bạn cho tôi mượn rất thú vị.',
    tip: 'Dùng cho đồ vật, con vật, sự việc. Có thể thay cả một mệnh đề phía trước nếu đứng sau dấu phẩy.',
  },
  {
    word: 'WHOSE',
    usedFor: 'Chỉ SỞ HỮU (của người hoặc vật)',
    role: 'Thay thế cho tính từ sở hữu (his, her, their, its...)',
    exampleEn: 'I know a boy whose father is a pilot.',
    exampleVi: 'Tôi biết một cậu bé có bố là phi công.',
    tip: 'Công thức nhận diện nhanh: Danh từ 1 + WHOSE + Danh từ 2 (thuộc sở hữu của Danh từ 1).',
  },
  {
    word: 'THAT',
    usedFor: 'Chỉ cả NGƯỜI và VẬT',
    role: 'Thay thế cho Who, Whom, Which trong mệnh đề xác định',
    exampleEn: 'This is the best movie that I have ever seen.',
    exampleVi: 'Đây là bộ phim hay nhất mà tôi từng xem.',
    tip: 'KHÔNG dùng THAT sau dấu phẩy (,) và sau giới từ (in that, on that là SAI).',
  },
  {
    word: 'WHERE',
    usedFor: 'Chỉ NƠI CHỐN',
    role: 'Trạng từ quan hệ (= in/at/on + which)',
    exampleEn: 'This is the school where I studied five years ago.',
    exampleVi: 'Đây là ngôi trường nơi tôi đã học 5 năm trước.',
    tip: 'Cẩn thận: Nếu phía sau chỉ nơi chốn nhưng thiếu chủ ngữ/tân ngữ cho động từ thì vẫn dùng WHICH (ví dụ: The house which I bought...).',
  },
  {
    word: 'WHEN',
    usedFor: 'Chỉ THỜI GIAN',
    role: 'Trạng từ quan hệ (= on/in/at + which)',
    exampleEn: 'Summer is the season when we often go to the beach.',
    exampleVi: 'Mùa hè là mùa mà chúng tôi thường đi biển.',
    tip: 'Thường đứng sau các danh từ chỉ thời gian: day, year, time, season, moment...',
  },
  {
    word: 'WHY',
    usedFor: 'Chỉ LÝ DO',
    role: 'Trạng từ quan hệ (= for which)',
    exampleEn: 'Tell me the reason why you were late.',
    exampleVi: 'Hãy nói cho tôi lý do tại sao bạn đến muộn.',
    tip: 'Thường đứng ngay sau cụm "the reason".',
  },
];

export const SENTENCE_COMBINE_DEMOS: SentenceCombineDemo[] = [
  {
    id: 'demo-who',
    title: 'Nối câu chỉ NGƯỜI (làm Chủ ngữ)',
    sentence1: 'The woman is my English teacher.',
    sentence2: 'She lives next door.',
    repeatedTarget: 'The woman ↔ She',
    pronoun: 'who',
    combinedSentence: 'The woman who lives next door is my English teacher.',
    translationVi: 'Người phụ nữ sống ở nhà bên cạnh là giáo viên tiếng Anh của tôi.',
    stepExplanation:
      'Bước 1: Tìm 2 từ chỉ cùng 1 người ("The woman" và "She"). Bước 2: Bỏ "She" và thay bằng "who". Bước 3: Đặt mệnh đề "who lives next door" ngay sau "The woman".',
  },
  {
    id: 'demo-which',
    title: 'Nối câu chỉ ĐỒ VẬT',
    sentence1: 'I bought a new phone.',
    sentence2: 'It has a very good camera.',
    repeatedTarget: 'a new phone ↔ It',
    pronoun: 'which',
    combinedSentence: 'I bought a new phone which has a very good camera.',
    translationVi: 'Tôi đã mua một chiếc điện thoại mới có camera rất tốt.',
    stepExplanation:
      'Bước 1: Hai câu cùng nhắc đến "a new phone" và "It". Bước 2: Thay "It" (chỉ vật) bằng "which" (hoặc "that") rồi ghép liền sau "a new phone".',
  },
  {
    id: 'demo-whose',
    title: 'Nối câu chỉ SỞ HỮU',
    sentence1: 'That is the student.',
    sentence2: 'Her essay won the first prize.',
    repeatedTarget: 'the student ↔ Her',
    pronoun: 'whose',
    combinedSentence: 'That is the student whose essay won the first prize.',
    translationVi: 'Đó là học sinh có bài luận đạt giải nhất.',
    stepExplanation:
      'Bước 1: "Her" là tính từ sở hữu của "the student". Bước 2: Thay "Her" bằng "whose" rồi giữ nguyên danh từ "essay" đứng ngay sau "whose".',
  },
  {
    id: 'demo-where',
    title: 'Nối câu chỉ NƠI CHỐN',
    sentence1: 'This is the café.',
    sentence2: 'We first met there.',
    repeatedTarget: 'the café ↔ there',
    pronoun: 'where',
    combinedSentence: 'This is the café where we first met.',
    translationVi: 'Đây là quán cà phê nơi chúng tôi gặp nhau lần đầu.',
    stepExplanation:
      'Bước 1: "there" (ở đó) thay cho địa điểm "the café". Bước 2: Bỏ "there" ở cuối câu và đặt trạng từ quan hệ "where" vào giữa hai mệnh đề.',
  },
];

export const RELATIVE_EXERCISES: RelativeExercise[] = [
  {
    id: 'rc-1',
    type: 'choice',
    question: 'The man ________ is standing over there is my uncle.',
    options: ['which', 'who', 'whom', 'whose'],
    answer: 'who',
    explanationVi:
      'Danh từ phía trước là "The man" (chỉ người) và ngay sau chỗ trống là động từ "is standing" → cần đại từ quan hệ làm chủ ngữ chỉ người là "who".',
  },
  {
    id: 'rc-2',
    type: 'choice',
    question: 'The laptop ________ I bought last week works very smoothly.',
    options: ['who', 'whom', 'which', 'where'],
    answer: 'which',
    explanationVi:
      '"The laptop" là đồ vật → dùng "which" (hoặc that). Không dùng "where" vì "bought" cần một tân ngữ là cái máy tính.',
  },
  {
    id: 'rc-3',
    type: 'choice',
    question: 'I talked to a girl ________ brother works at a big hospital.',
    options: ['who', 'whom', 'whose', 'which'],
    answer: 'whose',
    explanationVi:
      'Cấu trúc: a girl (danh từ 1) + ________ + brother (danh từ 2 = anh trai của cô ấy) → quan hệ sở hữu nên dùng "whose".',
  },
  {
    id: 'rc-4',
    type: 'choice',
    question: 'Hoi An is a peaceful town ________ many tourists love to visit.',
    options: ['where', 'which', 'when', 'who'],
    answer: 'which',
    explanationVi:
      'Cẩn thận bẫy! Tuy "Hoi An" là nơi chốn nhưng động từ "visit" chưa có tân ngữ (visit something), nghĩa là "thị trấn mà du khách thích đến thăm" → chọn "which" (nếu là "live" hoặc "stay" mới dùng "where").',
  },
  {
    id: 'rc-5',
    type: 'choice',
    question: 'This is the hotel ________ we stayed during our holiday.',
    options: ['which', 'where', 'who', 'whose'],
    answer: 'where',
    explanationVi:
      'Ở đây "stayed" không cần tân ngữ trực tiếp (ở tại khách sạn = stayed at the hotel) → chọn trạng từ chỉ nơi chốn "where".',
  },
  {
    id: 'rc-6',
    type: 'choice',
    question: 'Mr. Nam, ________ has taught here for 15 years, is retiring next month.',
    options: ['that', 'who', 'whom', 'which'],
    answer: 'who',
    explanationVi:
      'Đây là mệnh đề quan hệ không xác định (có dấu phẩy sau tên riêng "Mr. Nam") nên KHÔNG được dùng "that". Sau chỗ trống là động từ "has taught" nên chọn "who".',
  },
  {
    id: 'rc-7',
    type: 'choice',
    question: 'Do you remember the day ________ we first went to university?',
    options: ['where', 'which', 'when', 'why'],
    answer: 'when',
    explanationVi:
      '"The day" là danh từ chỉ thời gian, vế sau đầy đủ chủ-vị ("vào ngày đó chúng ta đi học đại học") → dùng "when".',
  },
  {
    id: 'rc-8',
    type: 'choice',
    question: 'The woman ________ you spoke to at the reception is the manager.',
    options: ['which', 'whom', 'whose', 'where'],
    answer: 'whom',
    explanationVi:
      '"The woman" chỉ người, phía sau là chủ ngữ + động từ ("you spoke to") nên đại từ đóng vai trò tân ngữ → chọn "whom" (hoặc who).',
  },
  {
    id: 'rc-9',
    type: 'choice',
    question: 'That is the reason ________ I decided to learn English seriously.',
    options: ['when', 'where', 'why', 'which'],
    answer: 'why',
    explanationVi:
      'Đứng sau "the reason" (lý do) để giải thích nguyên nhân → dùng trạng từ quan hệ "why".',
  },
  {
    id: 'rc-10',
    type: 'choice',
    question: 'The students ________ by the teacher received high scores.',
    options: ['praising', 'praised', 'who praising', 'which praised'],
    answer: 'praised',
    explanationVi:
      'Rút gọn mệnh đề quan hệ dạng bị động ("who were praised by the teacher" → những học sinh được giáo viên khen) → rút gọn còn V3/ed là "praised".',
  },
  {
    id: 'rc-11',
    type: 'fill',
    question: 'The boy ________ is playing football in the yard is my cousin.',
    hint: 'Đại từ chỉ người làm chủ ngữ',
    answer: 'who',
    acceptableAnswers: ['who', 'that'],
    explanationVi:
      'Danh từ "The boy" chỉ người và đứng trước động từ "is playing" → điền "who" (hoặc "that").',
  },
  {
    id: 'rc-12',
    type: 'fill',
    question: 'I lost the key ________ opens the front door.',
    hint: 'Đại từ chỉ vật làm chủ ngữ',
    answer: 'which',
    acceptableAnswers: ['which', 'that'],
    explanationVi:
      'Danh từ "the key" chỉ vật và đứng trước động từ "opens" → điền "which" (hoặc "that").',
  },
];
