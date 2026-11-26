export type TenseId =
  | 'present-simple'
  | 'present-continuous'
  | 'past-simple'
  | 'past-continuous'
  | 'future-simple'
  | 'near-future';

export interface TenseFormula {
  label: string;
  affirmative: string;
  negative: string;
  question: string;
  note?: string;
}

export interface TenseExample {
  en: string;
  vi: string;
  highlight: string;
}

export interface TenseLesson {
  id: TenseId;
  order: string;
  nameVi: string;
  nameEn: string;
  shortSummary: string;
  timelinePosition: 'past' | 'past-span' | 'present-habit' | 'present-now' | 'future-instant' | 'future-plan';
  timelineCaption: string;
  usages: string[];
  formulas: TenseFormula[];
  signals: string[];
  beginnerTips: string[];
  examples: TenseExample[];
}

export interface TenseExercise {
  id: string;
  tenseId: TenseId;
  type: 'choice' | 'fill';
  question: string;
  hint?: string;
  options?: string[];
  answer: string;
  acceptableAnswers?: string[];
  explanationVi: string;
}

export const TENSE_LESSONS: TenseLesson[] = [
  {
    id: 'present-simple',
    order: '01',
    nameVi: 'Thì Hiện tại đơn',
    nameEn: 'Present Simple',
    shortSummary: 'Diễn tả thói quen hằng ngày, sự thật hiển nhiên và lịch trình cố định.',
    timelinePosition: 'present-habit',
    timelineCaption: 'Lặp đi lặp lại ở hiện tại hoặc luôn luôn đúng (Quá khứ → Hiện tại → Tương lai).',
    usages: [
      'Thói quen, hành động lặp đi lặp lại hằng ngày (ví dụ: mỗi sáng tôi đều uống cà phê).',
      'Sự thật hiển nhiên, chân lý khoa học (ví dụ: Mặt Trời mọc ở hướng Đông).',
      'Sở thích, trạng thái, nghề nghiệp ở hiện tại (ví dụ: Cô ấy là giáo viên).',
      'Lịch trình tàu xe, máy bay, thời khóa biểu cố định.',
    ],
    formulas: [
      {
        label: 'Với động từ To Be (am / is / are)',
        affirmative: 'S + am / is / are + Danh từ / Tính từ',
        negative: 'S + am / is / are + not + Danh từ / Tính từ',
        question: 'Am / Is / Are + S + Danh từ / Tính từ?',
        note: 'I → am | He, She, It, Danh từ số ít → is | You, We, They, Danh từ số nhiều → are',
      },
      {
        label: 'Với động từ thường (V)',
        affirmative: 'S + V(nguyên mẫu) / V(s/es)',
        negative: 'S + do / does + not + V(nguyên mẫu)',
        question: 'Do / Does + S + V(nguyên mẫu)?',
        note: 'He/She/It thêm s/es vào động từ ở câu (+). Câu (-) và (?) mượn does thì động từ trả về nguyên mẫu.',
      },
    ],
    signals: [
      'always (luôn luôn)',
      'usually (thường xuyên)',
      'often (thường)',
      'sometimes (thỉnh thoảng)',
      'never (không bao giờ)',
      'every day / week / month',
      'once / twice a week',
    ],
    beginnerTips: [
      'Người mất gốc hay dùng thừa "am/is/are" trước động từ thường (Sai: "I am go to school" → Đúng: "I go to school").',
      'Thêm "-es" khi động từ kết thúc bằng: o, s, sh, ch, x, z (ví dụ: go → goes, watch → watches).',
      'Khi đã có "doesn\'t" hoặc "Does", tuyệt đối KHÔNG thêm s/es vào động từ chính nữa.',
    ],
    examples: [
      {
        en: 'She goes to work by bus every morning.',
        vi: 'Cô ấy đi làm bằng xe buýt mỗi sáng.',
        highlight: 'goes',
      },
      {
        en: 'They do not like spicy food.',
        vi: 'Họ không thích đồ ăn cay.',
        highlight: 'do not like',
      },
      {
        en: 'Does he live in Hanoi?',
        vi: 'Anh ấy có sống ở Hà Nội không?',
        highlight: 'Does ... live',
      },
    ],
  },
  {
    id: 'present-continuous',
    order: '02',
    nameVi: 'Thì Hiện tại tiếp diễn',
    nameEn: 'Present Continuous',
    shortSummary: 'Diễn tả hành động đang xảy ra ngay tại thời điểm nói hoặc xung quanh hiện tại.',
    timelinePosition: 'present-now',
    timelineCaption: 'Đang diễn ra ngay lúc này (tại điểm Hiện tại trên trục thời gian).',
    usages: [
      'Hành động đang diễn ra ngay tại lúc nói (Now, Look!, Listen!).',
      'Hành động đang diễn ra trong giai đoạn hiện tại (dù lúc nói có thể không làm, ví dụ: tuần này tôi đang đọc cuốn sách hay).',
      'Kế hoạch chắc chắn đã sắp xếp lịch sẵn trong tương lai gần.',
      'Diễn tả sự phàn nàn về thói quen xấu với "always" (Anh ta lúc nào cũng đi muộn!).',
    ],
    formulas: [
      {
        label: 'Cấu trúc chung (bắt buộc có To Be + V-ing)',
        affirmative: 'S + am / is / are + V-ing',
        negative: 'S + am / is / are + not + V-ing',
        question: 'Am / Is / Are + S + V-ing?',
        note: 'Không được quên "am / is / are" trước V-ing!',
      },
    ],
    signals: [
      'now (bây giờ)',
      'right now (ngay lúc này)',
      'at the moment',
      'at present',
      'Look! (Nhìn kìa!)',
      'Listen! (Nghe kìa!)',
      'Be quiet! (Im lặng nào!)',
    ],
    beginnerTips: [
      'Lỗi kinh điển của người mới: thiếu động từ To Be (Sai: "She cooking dinner" → Đúng: "She is cooking dinner").',
      'Quy tắc thêm -ing: Động từ tận cùng bằng "e" câm thì bỏ "e" thêm "-ing" (make → making, write → writing).',
      'Không chia tiếp diễn với các động từ chỉ cảm giác/nhận thức như: know, like, love, want, need, understand.',
    ],
    examples: [
      {
        en: 'Listen! Someone is knocking at the door.',
        vi: 'Nghe kìa! Ai đó đang gõ cửa.',
        highlight: 'is knocking',
      },
      {
        en: 'I am studying English at the moment.',
        vi: 'Hiện tại tôi đang học tiếng Anh.',
        highlight: 'am studying',
      },
      {
        en: 'Are they watching TV right now?',
        vi: 'Ngay lúc này họ có đang xem TV không?',
        highlight: 'Are ... watching',
      },
    ],
  },
  {
    id: 'past-simple',
    order: '03',
    nameVi: 'Thì Quá khứ đơn',
    nameEn: 'Past Simple',
    shortSummary: 'Diễn tả hành động đã xảy ra và chấm dứt hoàn toàn trong quá khứ.',
    timelinePosition: 'past',
    timelineCaption: 'Một điểm đã khép lại hoàn toàn trong Quá khứ, không còn liên quan đến hiện tại.',
    usages: [
      'Hành động đã bắt đầu và kết thúc hoàn toàn trong quá khứ có thời gian xác định.',
      'Chuỗi các hành động xảy ra liên tiếp nhau trong quá khứ (kể chuyện).',
      'Thói quen trong quá khứ nhưng nay không còn nữa.',
    ],
    formulas: [
      {
        label: 'Với động từ To Be (was / were)',
        affirmative: 'S + was / were + Danh từ / Tính từ',
        negative: 'S + was / were + not + Danh từ / Tính từ',
        question: 'Was / Were + S + Danh từ / Tính từ?',
        note: 'I, He, She, It, số ít → was | You, We, They, số nhiều → were',
      },
      {
        label: 'Với động từ thường (V2 / V-ed)',
        affirmative: 'S + V-ed (có quy tắc) / V2 (bất quy tắc)',
        negative: 'S + did + not (didn\'t) + V(nguyên mẫu)',
        question: 'Did + S + V(nguyên mẫu)?',
        note: 'Trong câu phủ định và nghi vấn, khi đã dùng "did / didn\'t" thì động từ quay về nguyên mẫu.',
      },
    ],
    signals: [
      'yesterday (hôm qua)',
      'last night / week / month / year',
      '... ago (2 days ago, 3 years ago)',
      'in + năm quá khứ (in 2020)',
      'when I was a child',
    ],
    beginnerTips: [
      'Nhớ chia làm 2 nhóm động từ: có quy tắc thêm -ed (play → played, study → studied) và bất quy tắc cột 2 (go → went, buy → bought, see → saw).',
      'Câu phủ định/câu hỏi KHÔNG chia V2/ed nữa (Sai: "Did you went?" → Đúng: "Did you go?").',
      'Đừng nhầm was/were với did: Nếu câu không có động từ hành động thì dùng was/were ("I was tired", không nói "I did tired").',
    ],
    examples: [
      {
        en: 'We visited Da Nang last summer.',
        vi: 'Chúng tôi đã đi thăm Đà Nẵng vào mùa hè năm ngoái.',
        highlight: 'visited',
      },
      {
        en: 'She bought a new laptop two days ago.',
        vi: 'Cô ấy đã mua một chiếc laptop mới hai ngày trước.',
        highlight: 'bought',
      },
      {
        en: 'Did you go to the party yesterday?',
        vi: 'Hôm qua bạn có đi dự tiệc không?',
        highlight: 'Did ... go',
      },
    ],
  },
  {
    id: 'past-continuous',
    order: '04',
    nameVi: 'Thì Quá khứ tiếp diễn',
    nameEn: 'Past Continuous',
    shortSummary: 'Diễn tả hành động đang xảy ra tại một thời điểm cụ thể trong quá khứ.',
    timelinePosition: 'past-span',
    timelineCaption: 'Một khoảng thời gian đang diễn ra trong Quá khứ (hoặc đang diễn ra thì có việc khác xen vào).',
    usages: [
      'Hành động đang diễn ra tại một giờ/thời điểm xác định trong quá khứ (ví dụ: lúc 8 giờ tối qua).',
      'Hành động đang diễn ra (Quá khứ tiếp diễn) thì một hành động khác xen vào (Quá khứ đơn).',
      'Hai hay nhiều hành động cùng đang diễn ra song song trong quá khứ (thường nối bằng "while").',
    ],
    formulas: [
      {
        label: 'Cấu trúc chung (was / were + V-ing)',
        affirmative: 'S + was / were + V-ing',
        negative: 'S + was / were + not + V-ing',
        question: 'Was / Were + S + V-ing?',
        note: 'I / He / She / It / số ít → was | You / We / They / số nhiều → were',
      },
    ],
    signals: [
      'at + giờ + yesterday (at 8 p.m. yesterday)',
      'at this time last week / year',
      'while (trong khi)',
      'when (khi - hành động xen vào)',
    ],
    beginnerTips: [
      'Mẹo nhớ câu có "When / While": Hành động kéo dài đang làm (nền) chia Quá khứ tiếp diễn; hành động ngắn bất ngờ xen vào chia Quá khứ đơn.',
      'Ví dụ kinh điển: "I was sleeping (đang ngủ) when the phone rang (điện thoại reo)."',
      'Chủ ngữ "I" đi với "was" (I was working), không đi với "were".',
    ],
    examples: [
      {
        en: 'At 9 p.m. yesterday, I was doing my homework.',
        vi: 'Lúc 9 giờ tối hôm qua, tôi đang làm bài tập về nhà.',
        highlight: 'was doing',
      },
      {
        en: 'They were having dinner when I arrived.',
        vi: 'Họ đang ăn tối thì tôi đến.',
        highlight: 'were having',
      },
      {
        en: 'While my mom was cooking, my dad was reading a book.',
        vi: 'Trong khi mẹ tôi đang nấu ăn thì bố tôi đang đọc sách.',
        highlight: 'was cooking ... was reading',
      },
    ],
  },
  {
    id: 'future-simple',
    order: '05',
    nameVi: 'Thì Tương lai đơn',
    nameEn: 'Future Simple (Will)',
    shortSummary: 'Diễn tả quyết định tức thì ngay lúc nói, lời hứa, đề nghị hoặc dự đoán không có căn cứ rõ.',
    timelinePosition: 'future-instant',
    timelineCaption: 'Hướng về Tương lai — quyết định nảy ra ngay tại thời điểm nói hoặc dự đoán chung.',
    usages: [
      'Quyết định tức thời ngay tại lúc nói, chưa có kế hoạch trước (ví dụ: Trời lạnh quá, tôi sẽ đóng cửa sổ).',
      'Lời hứa, lời đề nghị giúp đỡ, lời mời hoặc đe dọa.',
      'Dự đoán mang tính cá nhân, phỏng đoán (thường đi với think, believe, hope, probably).',
    ],
    formulas: [
      {
        label: 'Cấu trúc chung với Will (dùng cho mọi chủ ngữ)',
        affirmative: 'S + will + V(nguyên mẫu)',
        negative: 'S + will not (won\'t) + V(nguyên mẫu)',
        question: 'Will + S + V(nguyên mẫu)?',
        note: 'Sau "will" động từ luôn ở dạng nguyên mẫu không "to", không thêm s/es/ed/ing.',
      },
    ],
    signals: [
      'tomorrow (ngày mai)',
      'next week / month / year',
      'soon (sớm thôi)',
      'in the future',
      'I think / I hope / I promise',
      'probably / maybe',
    ],
    beginnerTips: [
      'Tuyệt đối KHÔNG thêm "to" sau "will" (Sai: "I will to call you" → Đúng: "I will call you").',
      'Phủ định của "will not" viết tắt là "won\'t", cẩn thận nhầm với "want" (muốn).',
      'Phân biệt nhanh với "be going to": "Will" là quyết định tức thì (vừa nghĩ ra) hoặc đoán mơ hồ; còn có kế hoạch trước hoặc có bằng chứng rành rành thì dùng "be going to".',
    ],
    examples: [
      {
        en: 'It is raining. I will take an umbrella.',
        vi: 'Trời đang mưa rồi. Tôi sẽ mang theo ô.',
        highlight: 'will take',
      },
      {
        en: 'I promise I won\'t tell anyone your secret.',
        vi: 'Tôi hứa tôi sẽ không nói bí mật của bạn cho ai đâu.',
        highlight: "won't tell",
      },
      {
        en: 'Will you help me carry this heavy box?',
        vi: 'Bạn sẽ giúp tôi bê cái hộp nặng này chứ?',
        highlight: 'Will ... help',
      },
    ],
  },
  {
    id: 'near-future',
    order: '06',
    nameVi: 'Thì Tương lai gần',
    nameEn: 'Near Future (Be going to)',
    shortSummary: 'Diễn tả dự định đã lên kế hoạch từ trước hoặc dự đoán dựa trên dấu hiệu thấy rõ ở hiện tại.',
    timelinePosition: 'future-plan',
    timelineCaption: 'Kế hoạch đã hình thành từ Hiện tại và sắp thực hiện trong Tương lai.',
    usages: [
      'Kế hoạch, dự định đã suy nghĩ và chuẩn bị từ trước khi nói (ví dụ: Tôi đã mua vé và sẽ bay vào tuần tới).',
      'Dự đoán một việc chắc chắn sắp xảy ra vì có bằng chứng, dấu hiệu rõ ràng ngay trước mắt (ví dụ: Mây đen kéo đến → Trời sắp mưa rồi).',
    ],
    formulas: [
      {
        label: 'Cấu trúc chung với Be going to',
        affirmative: 'S + am / is / are + going to + V(nguyên mẫu)',
        negative: 'S + am / is / are + not + going to + V(nguyên mẫu)',
        question: 'Am / Is / Are + S + going to + V(nguyên mẫu)?',
        note: 'Luôn chia "am / is / are" theo chủ ngữ; sau "going to" là động từ nguyên mẫu.',
      },
    ],
    signals: [
      'tonight / tomorrow / next weekend (khi đã có kế hoạch)',
      'Look at those dark clouds! (Bằng chứng trước mắt)',
      'in + khoảng thời gian (in two days)',
      'kèm ngữ cảnh đã mua vé, đã đặt lịch',
    ],
    beginnerTips: [
      'Đừng quên chữ "to" trước động từ chính (Sai: "I am going buy a car" → Đúng: "I am going to buy a car").',
      'Với động từ "go", người bản xứ hay rút ngắn "going to go" thành "going to" (ví dụ: I am going to the cinema tonight).',
      'Khi có bằng chứng nhìn thấy được (mây đen, xe lao nhanh, bụng bầu...) → Bắt buộc chọn "be going to", không chọn "will".',
    ],
    examples: [
      {
        en: 'Look at those black clouds! It is going to rain.',
        vi: 'Nhìn những đám mây đen kìa! Trời sắp mưa rồi.',
        highlight: 'is going to rain',
      },
      {
        en: 'We are going to visit our grandparents this weekend.',
        vi: 'Chúng tôi dự định đi thăm ông bà vào cuối tuần này.',
        highlight: 'are going to visit',
      },
      {
        en: 'Is he going to apply for that job?',
        vi: 'Anh ấy có dự định nộp đơn cho công việc đó không?',
        highlight: 'Is ... going to apply',
      },
    ],
  },
];

export const TENSE_EXERCISES: TenseExercise[] = [
  // Present Simple
  {
    id: 'ex-ps-1',
    tenseId: 'present-simple',
    type: 'choice',
    question: 'My father usually ________ coffee before going to work.',
    options: ['drink', 'drinks', 'is drinking', 'drank'],
    answer: 'drinks',
    explanationVi:
      'Có trạng từ "usually" diễn tả thói quen hằng ngày → chia Hiện tại đơn. Chủ ngữ "My father" (ngôi thứ 3 số ít) nên động từ "drink" thêm "s" thành "drinks".',
  },
  {
    id: 'ex-ps-2',
    tenseId: 'present-simple',
    type: 'choice',
    question: 'The train ________ at 7:30 a.m. every day.',
    options: ['leave', 'leaves', 'is leaving', 'will leave'],
    answer: 'leaves',
    explanationVi:
      'Lịch trình tàu xe cố định và có "every day" → chia Hiện tại đơn. "The train" là danh từ số ít nên chọn "leaves".',
  },
  {
    id: 'ex-ps-3',
    tenseId: 'present-simple',
    type: 'fill',
    question: 'She (not / watch) ________ television on weekdays.',
    hint: 'Câu phủ định hiện tại đơn với chủ ngữ "She"',
    answer: "doesn't watch",
    acceptableAnswers: ['does not watch', "doesn't watch"],
    explanationVi:
      'Câu phủ định Hiện tại đơn với chủ ngữ số ít "She" ta mượn trợ động từ "does not" (hoặc "doesn\'t") và giữ nguyên mẫu động từ "watch".',
  },
  {
    id: 'ex-ps-4',
    tenseId: 'present-simple',
    type: 'choice',
    question: '________ your sister speak Japanese fluently?',
    options: ['Do', 'Does', 'Is', 'Are'],
    answer: 'Does',
    explanationVi:
      'Câu hỏi có động từ thường "speak" ở Hiện tại đơn, chủ ngữ là "your sister" (số ít) nên mượn trợ động từ "Does".',
  },

  // Present Continuous
  {
    id: 'ex-pc-1',
    tenseId: 'present-continuous',
    type: 'choice',
    question: 'Be quiet! The baby ________ in the next room.',
    options: ['sleeps', 'slept', 'is sleeping', 'will sleep'],
    answer: 'is sleeping',
    explanationVi:
      'Có câu mệnh lệnh "Be quiet!" báo hiệu hành động đang xảy ra ngay lúc nói → chia Hiện tại tiếp diễn: "is sleeping".',
  },
  {
    id: 'ex-pc-2',
    tenseId: 'present-continuous',
    type: 'choice',
    question: 'Right now, the students ________ an English test.',
    options: ['are taking', 'take', 'took', 'were taking'],
    answer: 'are taking',
    explanationVi:
      'Có dấu hiệu "Right now" (ngay lúc này) và chủ ngữ số nhiều "the students" → chia Hiện tại tiếp diễn: "are taking".',
  },
  {
    id: 'ex-pc-3',
    tenseId: 'present-continuous',
    type: 'fill',
    question: 'Look! Minh (run) ________ very fast to catch the bus.',
    hint: 'Đừng quên nhân đôi phụ âm cuối của "run" khi thêm -ing',
    answer: 'is running',
    acceptableAnswers: ['is running'],
    explanationVi:
      'Có dấu hiệu "Look!" → chia Hiện tại tiếp diễn. Chủ ngữ "Minh" đi với "is", động từ "run" (1 âm tiết, 1 nguyên âm giữa 2 phụ âm) gấp đôi chữ "n" thành "is running".',
  },
  {
    id: 'ex-pc-4',
    tenseId: 'present-continuous',
    type: 'choice',
    question: 'Where is Lan? — She ________ dinner in the kitchen at the moment.',
    options: ['cooks', 'cooked', 'is cooking', 'was cooking'],
    answer: 'is cooking',
    explanationVi:
      'Có cụm "at the moment" (ngay lúc này) → chia Hiện tại tiếp diễn: "is cooking".',
  },

  // Past Simple
  {
    id: 'ex-pa-1',
    tenseId: 'past-simple',
    type: 'choice',
    question: 'I ________ my old friend at the supermarket yesterday.',
    options: ['meet', 'met', 'am meeting', 'will meet'],
    answer: 'met',
    explanationVi:
      'Có dấu hiệu "yesterday" (hôm qua) → chia Quá khứ đơn. Quá khứ bất quy tắc của "meet" là "met".',
  },
  {
    id: 'ex-pa-2',
    tenseId: 'past-simple',
    type: 'choice',
    question: 'They ________ at home last night because they were tired.',
    options: ['stay', 'stayed', 'were staying', 'are staying'],
    answer: 'stayed',
    explanationVi:
      'Có "last night" → chia Quá khứ đơn. Động từ có quy tắc "stay" thêm "-ed" thành "stayed".',
  },
  {
    id: 'ex-pa-3',
    tenseId: 'past-simple',
    type: 'fill',
    question: 'Did you (buy) ________ that jacket three days ago?',
    hint: 'Sau "Did", động từ chia thế nào?',
    answer: 'buy',
    acceptableAnswers: ['buy'],
    explanationVi:
      'Trong câu hỏi Quá khứ đơn đã có trợ động từ "Did" ở đầu câu nên động từ chính giữ nguyên mẫu là "buy" (không đổi thành bought).',
  },
  {
    id: 'ex-pa-4',
    tenseId: 'past-simple',
    type: 'choice',
    question: 'We ________ very happy when we passed the exam last month.',
    options: ['did', 'was', 'were', 'are'],
    answer: 'were',
    explanationVi:
      'Câu dùng tính từ "happy" (không có động từ thường) ở quá khứ ("last month"), chủ ngữ "We" đi với To Be quá khứ là "were".',
  },

  // Past Continuous
  {
    id: 'ex-pac-1',
    tenseId: 'past-continuous',
    type: 'choice',
    question: 'At 8 o\'clock last night, my family ________ a movie together.',
    options: ['watched', 'was watching', 'is watching', 'watches'],
    answer: 'was watching',
    explanationVi:
      'Có mốc thời gian cụ thể trong quá khứ "At 8 o\'clock last night" → hành động đang diễn ra tại thời điểm đó → Quá khứ tiếp diễn: "was watching".',
  },
  {
    id: 'ex-pac-2',
    tenseId: 'past-continuous',
    type: 'choice',
    question: 'I ________ to music when my mother came home.',
    options: ['listened', 'am listening', 'was listening', 'will listen'],
    answer: 'was listening',
    explanationVi:
      'Hành động "đang nghe nhạc" đang kéo dài thì hành động "mẹ về" (came - Quá khứ đơn) xen vào → vế đang diễn ra chia Quá khứ tiếp diễn: "was listening".',
  },
  {
    id: 'ex-pac-3',
    tenseId: 'past-continuous',
    type: 'fill',
    question: 'While Anna (read) ________ a book, Tom was playing the guitar.',
    hint: 'Hai hành động diễn ra song song trong quá khứ',
    answer: 'was reading',
    acceptableAnswers: ['was reading'],
    explanationVi:
      'Từ "While" nối hai hành động diễn ra song song trong quá khứ. Chủ ngữ "Anna" (số ít) đi với "was reading".',
  },
  {
    id: 'ex-pac-4',
    tenseId: 'past-continuous',
    type: 'choice',
    question: 'What ________ you ________ at this time yesterday?',
    options: ['did / do', 'were / doing', 'was / doing', 'are / doing'],
    answer: 'were / doing',
    explanationVi:
      'Cụm "at this time yesterday" (vào giờ này hôm qua) là dấu hiệu của Quá khứ tiếp diễn. Chủ ngữ "you" đi với "were" → "were / doing".',
  },

  // Future Simple
  {
    id: 'ex-fs-1',
    tenseId: 'future-simple',
    type: 'choice',
    question: 'Oh, you forgot your pen! Wait a second, I ________ you mine.',
    options: ['lend', 'am lending', 'will lend', 'lent'],
    answer: 'will lend',
    explanationVi:
      'Quyết định đưa ra tức thì ngay tại thời điểm nói (vừa nghe bạn quên bút nên cho mượn) → dùng Tương lai đơn "will lend".',
  },
  {
    id: 'ex-fs-2',
    tenseId: 'future-simple',
    type: 'choice',
    question: 'I think our team ________ the match tomorrow.',
    options: ['will win', 'wins', 'won', 'is winning'],
    answer: 'will win',
    explanationVi:
      'Dự đoán mang tính chủ quan với cụm "I think" + "tomorrow" → dùng Tương lai đơn "will win".',
  },
  {
    id: 'ex-fs-3',
    tenseId: 'future-simple',
    type: 'fill',
    question: 'I promise I (not / be) ________ late for class again.',
    hint: 'Dùng dạng rút gọn hoặc đầy đủ của will not + be',
    answer: "won't be",
    acceptableAnswers: ["won't be", 'will not be'],
    explanationVi:
      'Lời hứa ("I promise") chia ở Tương lai đơn. Phủ định của "will" là "won\'t" (hoặc "will not") + động từ nguyên mẫu "be".',
  },
  {
    id: 'ex-fs-4',
    tenseId: 'future-simple',
    type: 'choice',
    question: '________ you please open the window? It is quite hot in here.',
    options: ['Will', 'Did', 'Are', 'Does'],
    answer: 'Will',
    explanationVi:
      'Câu yêu cầu/nhờ vả lịch sự ở thời điểm hiện tại hướng tới tương lai dùng "Will you please...".',
  },

  // Near Future
  {
    id: 'ex-nf-1',
    tenseId: 'near-future',
    type: 'choice',
    question: 'Watch out! That glass is on the edge of the table. It ________!',
    options: ['falls', 'fell', 'is going to fall', 'was falling'],
    answer: 'is going to fall',
    explanationVi:
      'Có bằng chứng rõ ràng ngay trước mắt ("cái ly nằm sát mép bàn") → dự đoán chắc chắn sắp xảy ra dùng Tương lai gần "is going to fall".',
  },
  {
    id: 'ex-nf-2',
    tenseId: 'near-future',
    type: 'choice',
    question: 'We bought the plane tickets yesterday. We ________ to Phu Quoc next Sunday.',
    options: ['are going to fly', 'fly', 'flew', 'were flying'],
    answer: 'are going to fly',
    explanationVi:
      'Kế hoạch đã được chuẩn bị chắc chắn từ trước (đã mua vé máy bay hôm qua) → dùng Tương lai gần "are going to fly".',
  },
  {
    id: 'ex-nf-3',
    tenseId: 'near-future',
    type: 'fill',
    question: 'Lan has saved enough money. She (buy) ________ a new bicycle next month.',
    hint: 'Dự định có kế hoạch từ trước (đã tiết kiệm đủ tiền)',
    answer: 'is going to buy',
    acceptableAnswers: ['is going to buy'],
    explanationVi:
      'Lan đã lên kế hoạch và tiết kiệm tiền từ trước → chia Tương lai gần với chủ ngữ "She": "is going to buy".',
  },
  {
    id: 'ex-nf-4',
    tenseId: 'near-future',
    type: 'choice',
    question: 'Look at the dark sky! It ________ soon.',
    options: ['rains', 'is going to rain', 'rained', 'was raining'],
    answer: 'is going to rain',
    explanationVi:
      'Nhìn thấy bầu trời tối sầm ("Look at the dark sky!") là dấu hiệu rõ ràng ở hiện tại → dùng Tương lai gần "is going to rain".',
  },
];
