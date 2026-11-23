import type { LangStr } from './cv';

export type ProjectStatus = 'live' | 'video' | 'source' | 'private' | 'pending';

export interface ProjectLink {
  label: LangStr;
  url: string;
  kind: 'demo' | 'github' | 'video' | 'showcase';
}

export interface ProjectPreviewMedia {
  poster: string;
  video: string;
  alt: LangStr;
  sourceLabel: LangStr;
  sourceUrl?: string;
}

export interface FeaturedProject {
  slug: 'japano' | 'fanpage-chatbot' | 'saigon-77' | 'math-lab' | 'smart-classroom' | 'kho' | 'picko247' | 'happytoplay' | 'vehicle-counting' | 'task1-coach' | 'hostora-ai' | 'vocalab' | 'vector-vu-tru' | 'run-fpl';
  order: string;
  year: string;
  title: string;
  eyebrow: LangStr;
  statement: LangStr;
  summary: LangStr;
  problem: LangStr;
  solution: LangStr;
  contribution: LangStr;
  status: ProjectStatus;
  statusLabel: LangStr;
  accent: string;
  accentSoft: string;
  ink: string;
  stack: string[];
  highlights: LangStr[];
  links: ProjectLink[];
  preview: ProjectPreviewMedia;
  media?: {
    file: string;
    alt: LangStr;
    label: LangStr;
    source: string;
  };
}

export const featuredProjects: FeaturedProject[] = [
  {
    slug: 'japano',
    order: '01',
    year: '2026',
    title: 'JAPANO',
    eyebrow: { en: 'AI fashion commerce ecosystem', vi: 'Hệ sinh thái thời trang và AI' },
    statement: {
      en: 'Try it on. Understand the fit. Continue the journey.',
      vi: 'Thử trên ảnh thật. Hiểu độ vừa vặn. Tiếp tục hành trình.',
    },
    summary: {
      en: 'A Japanese fashion platform spanning an Android app, web storefront, operations console and local GPU services on one commerce backend.',
      vi: 'Nền tảng thời trang Nhật Bản kết nối ứng dụng Android, web bán hàng, trung tâm vận hành và cụm dịch vụ GPU trên cùng một backend thương mại.',
    },
    problem: {
      en: 'Online shoppers see a model and a size chart, but cannot see the garment on themselves or understand how the selected size changes its drape.',
      vi: 'Người mua online chỉ thấy người mẫu và bảng size; họ chưa thấy trang phục trên chính mình hoặc hiểu size đã chọn làm vải ôm/rủ ra sao.',
    },
    solution: {
      en: 'A three-in-one journey for shopping, exploring Japan and AI virtual try-on, backed by server-side commerce rules and quality-gated image generation.',
      vi: 'Hành trình 3 trong 1 gồm mua sắm, khám phá Nhật Bản và thử đồ AI, với luật thương mại phía server và cổng kiểm định ảnh trước khi trả kết quả.',
    },
    contribution: {
      en: 'Product engineering across mobile, storefront, backend integration, AI orchestration and technical presentation.',
      vi: 'Kỹ thuật sản phẩm xuyên suốt mobile, storefront, tích hợp backend, điều phối AI và trình bày kỹ thuật.',
    },
    status: 'video',
    statusLabel: { en: 'Showcase & video demo', vi: 'Trang giới thiệu & video demo' },
    accent: '#ef4938',
    accentSoft: '#f5c4cf',
    ink: '#281016',
    stack: ['React Native', 'Expo', 'React 19', 'Node.js', 'MongoDB', 'PyTorch', 'FASHN VTON', 'FLUX.2'],
    highlights: [
      { en: 'Mobile, storefront and Admin share one source of commerce truth.', vi: 'Mobile, storefront và Admin dùng chung một nguồn dữ liệu thương mại.' },
      { en: 'Fit changes the generated garment structure instead of becoming a warning label.', vi: 'Độ vừa vặn tác động vào cấu trúc trang phục sinh ra, không chỉ là một dòng cảnh báo.' },
      { en: 'Body estimates remain ranges with evidence and user-entered measurements win.', vi: 'Số đo từ ảnh luôn là khoảng có bằng chứng; số đo người dùng nhập được ưu tiên.' },
      { en: 'FASHN is inference; the trained artifact is a separate FLUX.2 fit-refinement LoRA.', vi: 'FASHN là inference; artifact được huấn luyện là LoRA fit-refinement riêng trên FLUX.2.' },
    ],
    links: [
      {
        label: { en: 'Explore JAPANO', vi: 'Khám phá JAPANO' },
        url: 'https://japano-golden-ticket-showcase.lnhat1938.workers.dev/',
        kind: 'showcase',
      },
      {
        label: { en: 'Watch JAPANO app demo', vi: 'Xem demo ứng dụng JAPANO' },
        url: 'https://youtu.be/D8jqwvPUfFc?si=MZTFf8joSed97OcD',
        kind: 'video',
      },
    ],
    preview: {
      poster: 'projects/previews/japano.webp',
      video: 'projects/previews/japano.mp4',
      alt: { en: 'JAPANO mobile fashion app showing its shopping and AI try-on journey.', vi: 'Ứng dụng thời trang JAPANO hiển thị hành trình mua sắm và thử đồ AI.' },
      sourceLabel: { en: 'Real JAPANO app demo', vi: 'Demo ứng dụng JAPANO thật' },
      sourceUrl: 'https://youtu.be/D8jqwvPUfFc',
    },
    media: {
      file: 'projects/japano-showcase.webp',
      alt: {
        en: 'JAPANO showcase artwork: a woman in a floral kimono holding a red parasol beneath cherry blossoms.',
        vi: 'Ảnh thương hiệu từ JAPANO Showcase: người phụ nữ mặc kimono hoa, cầm ô đỏ dưới cành hoa anh đào.',
      },
      label: { en: 'JAPANO · GOLDEN TICKET SHOWCASE', vi: 'JAPANO · VÉ VÀNG ĐẾN ĐÂY' },
      source: 'japano-golden-ticket-showcase.lnhat1938.workers.dev',
    },
  },
  {
    slug: 'fanpage-chatbot',
    order: '02',
    year: '2026',
    title: 'FANPAGE AI CHATBOT',
    eyebrow: { en: 'Grounded Vietnamese LLM assistant', vi: 'Trợ lý LLM tiếng Việt có căn cứ' },
    statement: {
      en: 'Answer in Vietnamese. Cite the source. Say so when there is none.',
      vi: 'Trả lời bằng tiếng Việt. Dẫn nguồn. Nói rõ khi chưa có nguồn.',
    },
    summary: {
      en: 'A self-hosted AI assistant for a Facebook Fanpage and a website chat widget: a fine-tuned Qwen3-4B on a local GPU, retrieval over sourced knowledge and PDF/Word documents, and image understanding through OCR and a custom-trained YOLO detector.',
      vi: 'Trợ lý AI tự vận hành cho Fanpage Facebook và khung chat website: Qwen3-4B đã fine-tune chạy trên GPU local, truy xuất từ kho kiến thức có nguồn và tài liệu PDF/Word, hiểu ảnh bằng OCR và detector YOLO tự huấn luyện.',
    },
    problem: {
      en: 'A small 4B model answering the public will state outdated or invented facts with confidence — wrong dates, fake links, “verified” claims — and a page cannot afford that.',
      vi: 'Model 4B nhỏ trả lời công chúng sẽ tự tin nói điều cũ hoặc bịa — sai ngày, link giả, tự nhận “đã kiểm chứng” — điều một fanpage không thể chấp nhận.',
    },
    solution: {
      en: 'Grounding at every layer: facts may only come from a sourced knowledge base or ingested documents, a model-independent output check strips fabricated links and claims, arithmetic and dates are computed in code, and a fine-tuned adapter teaches the grounded style.',
      vi: 'Căn cứ ở mọi tầng: sự kiện chỉ lấy từ kho kiến thức có nguồn hoặc tài liệu đã nạp, bộ kiểm tra đầu ra độc lập với model xóa link và khẳng định bịa, phép tính và ngày tháng tính bằng code, còn adapter fine-tune dạy cách trả lời có căn cứ.',
    },
    contribution: {
      en: 'Solo build — architecture, signed webhook and durable queue, LangGraph conversation graph, RAG, LoRA/VeRA fine-tuning and evaluation, YOLO training, model serving, website widget, 246 tests and an operations CLI.',
      vi: 'Làm một mình — kiến trúc, webhook ký số và hàng đợi bền, conversation graph LangGraph, RAG, fine-tune và đánh giá LoRA/VeRA, huấn luyện YOLO, phục vụ model, widget website, 246 test và CLI vận hành.',
    },
    status: 'source',
    statusLabel: { en: 'GitHub source · local GPU', vi: 'Mã nguồn GitHub · chạy GPU local' },
    accent: '#2f6bff',
    accentSoft: '#dfe7ff',
    ink: '#0b1640',
    stack: ['Qwen3-4B + VeRA', 'LangGraph', 'RAG · pgvector', 'FastAPI', 'PEFT', 'YOLO26', 'EasyOCR', 'PostgreSQL', 'Docker Compose', 'TypeScript'],
    highlights: [
      { en: 'A VeRA adapter training only 0.03% of the weights lifted the 50-scenario evaluation from 43 to 46 passes and cut fabrication signals from 7 to 3.', vi: 'Adapter VeRA chỉ huấn luyện 0,03% trọng số đã nâng kết quả 50 kịch bản từ 43 lên 46 và giảm tín hiệu bịa từ 7 xuống 3.' },
      { en: 'Messenger and the website widget share one signed webhook → durable PostgreSQL queue → worker → LangGraph → guardrail path.', vi: 'Messenger và widget website dùng chung một đường webhook ký số → hàng đợi PostgreSQL bền → worker → LangGraph → kiểm tra đầu ra.' },
      { en: 'Document search fuses Vietnamese embeddings in pgvector with keyword search through Reciprocal Rank Fusion, behind a calibrated similarity floor.', vi: 'Tìm tài liệu gộp embedding tiếng Việt trong pgvector với tìm từ khóa bằng Reciprocal Rank Fusion, có ngưỡng tương đồng đã hiệu chỉnh.' },
      { en: 'A custom YOLO26n detector for 91 classroom and game objects reaches mAP50 0.930 on 1,149 unseen test images.', vi: 'Detector YOLO26n tự huấn luyện cho 91 lớp đồ vật lớp học và trò chơi đạt mAP50 0,930 trên 1.149 ảnh test chưa từng thấy.' },
    ],
    links: [
      {
        label: { en: 'Source code', vi: 'Mã nguồn' },
        url: 'https://github.com/minhnhatdepzai/fanpage-chatbot',
        kind: 'github',
      },
    ],
    preview: {
      poster: 'projects/previews/fanpage-chatbot.webp',
      video: 'projects/previews/fanpage-chatbot.mp4',
      alt: { en: 'Fanpage AI Chatbot website widget answering a grounded Vietnamese question.', vi: 'Widget Fanpage AI Chatbot trả lời một câu hỏi tiếng Việt có căn cứ.' },
      sourceLabel: { en: 'Product UI walkthrough', vi: 'Video giới thiệu giao diện sản phẩm' },
      sourceUrl: 'https://github.com/minhnhatdepzai/fanpage-chatbot',
    },
  },
  {
    slug: 'saigon-77',
    order: '03',
    year: '2026',
    title: 'SAIGON // 77',
    eyebrow: { en: 'Browser-native 3D open world', vi: 'Thế giới mở 3D trên trình duyệt' },
    statement: {
      en: 'A living city slice — walk it, drive it, survive it.',
      vi: 'Một lát cắt thành phố sống động — đi bộ, lái xe và sinh tồn.',
    },
    summary: {
      en: 'A desktop-first WebGL open-world vertical slice inspired by contemporary Ho Chi Minh City, with an explorable city, traffic, pedestrians, missions, vehicles and instanced activities.',
      vi: 'Vertical slice thế giới mở WebGL, ưu tiên desktop và lấy cảm hứng từ TP.HCM đương đại, với thành phố có thể khám phá, giao thông, người đi bộ, nhiệm vụ, phương tiện và các hoạt động riêng.',
    },
    problem: {
      en: 'A dense open-world experience must keep navigation, simulation and progression readable without overwhelming a browser renderer.',
      vi: 'Một trải nghiệm thế giới mở dày đặc phải giữ điều hướng, mô phỏng và tiến trình rõ ràng mà không làm quá tải trình duyệt.',
    },
    solution: {
      en: 'Original procedural city systems, adaptive graphics, local career persistence and a shared settlement loop connect street play with seven playable activities.',
      vi: 'Hệ thống thành phố procedural nguyên bản, đồ họa thích ứng, lưu tiến trình local và vòng lặp phần thưởng chung kết nối đường phố với bảy hoạt động có thể chơi.',
    },
    contribution: {
      en: 'World and gameplay systems, driving and NPC behavior, mission architecture, performance adaptation and browser validation.',
      vi: 'Hệ thống thế giới và gameplay, lái xe và hành vi NPC, kiến trúc nhiệm vụ, thích ứng hiệu năng và kiểm thử trên trình duyệt.',
    },
    status: 'live',
    statusLabel: { en: 'Playable demo · desktop', vi: 'Có bản chơi thử · desktop' },
    accent: '#ffd32a',
    accentSoft: '#d84b32',
    ink: '#24100b',
    stack: ['React', 'TypeScript', 'Three.js', 'React Three Fiber', 'WebGL 2', 'IndexedDB', 'Playwright'],
    highlights: [
      { en: 'Walking, driving, traffic, pedestrians, street interactions and city missions share one playable world.', vi: 'Đi bộ, lái xe, giao thông, người đi bộ, tương tác đường phố và nhiệm vụ cùng tồn tại trong một thế giới chơi được.' },
      { en: 'Seven activities include racing, construction escape, memory bridge, football, prop hunt and maze combat.', vi: 'Bảy hoạt động gồm đua xe, vượt công trường, cầu trí nhớ, bóng đá, núp lốt đồ vật và đấu mê cung.' },
      { en: 'Automatic graphics respond to the actual renderer and sustained frame performance.', vi: 'Đồ họa tự động phản ứng theo renderer thực tế và hiệu năng khung hình duy trì.' },
      { en: 'The project uses original procedural systems and explicitly excludes extracted commercial-game assets.', vi: 'Dự án dùng hệ thống procedural nguyên bản và loại trừ rõ ràng asset trích xuất từ game thương mại.' },
    ],
    links: [
      { label: { en: 'Play the game', vi: 'Chơi thử game' }, url: 'https://saigon-77-open-world.lnhat1938.workers.dev/', kind: 'demo' },
      { label: { en: 'View private repository', vi: 'Mở kho mã nguồn riêng tư' }, url: 'https://github.com/minhnhatdepzai/saigon-77-open-world', kind: 'github' },
    ],
    preview: {
      poster: 'projects/previews/saigon-77.webp',
      video: 'projects/previews/saigon-77.mp4',
      alt: { en: 'SAIGON 77 browser game showing its open-world city and driving interface.', vi: 'Game trình duyệt SAIGON 77 hiển thị thành phố thế giới mở và giao diện lái xe.' },
      sourceLabel: { en: 'Live game capture', vi: 'Video quay từ game đang chạy' },
      sourceUrl: 'https://saigon-77-open-world.lnhat1938.workers.dev/',
    },
  },
  {
    slug: 'math-lab',
    order: '04',
    year: '2026',
    title: 'MATH VISION LAB',
    eyebrow: { en: 'Explainable EdTech', vi: 'EdTech trực quan và giải thích được' },
    statement: {
      en: 'From a problem to a scene you can inspect, play and understand.',
      vi: 'Từ đề toán thành một mô phỏng có thể nhìn, chạy và hiểu từng bước.',
    },
    summary: {
      en: 'A grade 1–9 visual mathematics pipeline that turns text or an image into a semantic model, pedagogy plan and synchronized renderer.',
      vi: 'Pipeline toán trực quan lớp 1–9 biến văn bản hoặc ảnh thành semantic model, kế hoạch sư phạm và renderer đồng bộ.',
    },
    problem: {
      en: 'A correct final answer is not enough when the learner cannot see quantities, relationships and transformations.',
      vi: 'Một đáp án đúng vẫn chưa đủ khi người học không nhìn thấy đại lượng, quan hệ và từng phép biến đổi.',
    },
    solution: {
      en: 'A hybrid pipeline: Qwen3-VL reads images and fills semantic JSON when grammar needs help; deterministic solvers, 29 visual types and shared playback keep each teaching step verifiable.',
      vi: 'Pipeline lai: Qwen3-VL đọc ảnh và bổ sung JSON ngữ nghĩa khi grammar cần hỗ trợ; bộ giải xác định, 29 kiểu trực quan và playback dùng chung giúp kiểm chứng từng bước giảng.',
    },
    contribution: {
      en: 'Math-scene architecture, visualization coverage, renderer integration, regression gates and isolated demo workflow.',
      vi: 'Kiến trúc MathScene, độ phủ trực quan, tích hợp renderer, regression gate và quy trình demo cô lập.',
    },
    status: 'video',
    statusLabel: { en: 'Video demo available', vi: 'Có video demo' },
    accent: '#4f7cff',
    accentSoft: '#78e7ff',
    ink: '#0a1430',
    stack: ['React 19', 'Three.js', 'Python', 'FastAPI', 'Pydantic', 'Qwen3-VL 8B', 'Ollama', 'QLoRA (pilot)', 'PostgreSQL', 'Redis'],
    highlights: [
      { en: 'Semantic model → decision engine → pedagogy → scene → renderer.', vi: 'Semantic model → decision engine → pedagogy → scene → renderer.' },
      { en: 'Bar models, fractions, algebra tiles, graphs, Oxyz and 3D geometry.', vi: 'Bar model, phân số, algebra tiles, đồ thị, Oxyz và hình học 3D.' },
      { en: 'One playback state keeps every representation on the same teaching step.', vi: 'Một playback state giữ mọi biểu diễn ở đúng cùng một bước giảng.' },
      { en: 'Unsupported input explains its limit rather than inventing a visual.', vi: 'Đề chưa hỗ trợ được giải thích giới hạn thay vì tự dựng hình sai.' },
    ],
    links: [
      {
        label: { en: 'Watch case demo', vi: 'Xem video demo' },
        url: 'https://youtu.be/Ee5RhmHy5AE',
        kind: 'video',
      },
      {
        label: { en: 'Source code', vi: 'Mã nguồn' },
        url: 'https://github.com/minhnhatdepzai/EduVisionAI-Math-Lab',
        kind: 'github',
      },
    ],
    preview: {
      poster: 'projects/previews/math-lab.webp',
      video: 'projects/previews/math-lab.mp4',
      alt: { en: 'Math Vision Lab turning a mathematics problem into a synchronized visual lesson.', vi: 'Math Vision Lab biến một bài toán thành bài giảng trực quan đồng bộ.' },
      sourceLabel: { en: 'Real Math Lab demo', vi: 'Demo Math Lab thật' },
      sourceUrl: 'https://youtu.be/Ee5RhmHy5AE',
    },
    media: {
      file: 'projects/mathlab-video.jpg',
      alt: {
        en: 'Real Math Vision Lab interface from the supplied demo video, showing a visual multiplication lesson and synchronized controls.',
        vi: 'Giao diện Math Vision Lab thật từ video demo được cung cấp, hiển thị bài học phép nhân trực quan và các điều khiển đồng bộ.',
      },
      label: { en: 'REAL VIDEO FRAME', vi: 'KHUNG HÌNH VIDEO THẬT' },
      source: 'youtu.be/Ee5RhmHy5AE',
    },
  },
  {
    slug: 'smart-classroom',
    order: '05',
    year: '2026',
    title: 'EDUVISION AI',
    eyebrow: { en: 'Cinematic smart-classroom story', vi: 'Câu chuyện lớp học thông minh cinematic' },
    statement: {
      en: 'Scroll through the classroom. See where AI quietly helps.',
      vi: 'Cuộn qua lớp học. Nhìn thấy nơi AI hỗ trợ một cách âm thầm.',
    },
    summary: {
      en: 'A cinematic product experience for the EduVision AI smart classroom, using a code-built Three.js scene to connect vision, teaching, 3D learning, remote control and digital-twin concepts.',
      vi: 'Trải nghiệm sản phẩm cinematic cho lớp học thông minh EduVision AI, dùng cảnh Three.js dựng bằng code để kết nối AI Vision, giảng dạy, học tập 3D, điều khiển từ xa và digital twin.',
    },
    problem: {
      en: 'A conventional landing page can name classroom features, but it cannot show how people, cameras, teaching tools and AI relate in space and time.',
      vi: 'Landing page thông thường có thể kể tên tính năng, nhưng khó cho thấy con người, camera, công cụ dạy học và AI liên kết trong không gian lẫn thời gian.',
    },
    solution: {
      en: 'A scroll-driven 3D classroom with camera keyframes, procedural characters, visual system states and graceful model fallbacks.',
      vi: 'Lớp học 3D điều khiển theo cuộn với camera keyframe, nhân vật procedural, các trạng thái trực quan của hệ thống và fallback model an toàn.',
    },
    contribution: {
      en: 'Creative direction, procedural 3D, character systems, scroll choreography, responsive behavior and deployment setup.',
      vi: 'Định hướng sáng tạo, 3D procedural, hệ nhân vật, biên đạo cuộn, responsive và thiết lập triển khai.',
    },
    status: 'source',
    statusLabel: { en: 'Public source available', vi: 'Có mã nguồn công khai' },
    accent: '#6ff7d2',
    accentSoft: '#173f52',
    ink: '#071c27',
    stack: ['Three.js', 'JavaScript', 'WebGL', 'GLTFLoader', 'Procedural 3D', 'Cloudflare Workers'],
    highlights: [
      { en: 'Eleven scroll chapters move from a logo portal into a complete AI-classroom story.', vi: 'Mười một chương cuộn đi từ cổng logo tới câu chuyện lớp học AI hoàn chỉnh.' },
      { en: 'Teacher and student systems combine a rigged teacher model with procedural fallbacks.', vi: 'Hệ giáo viên và học sinh kết hợp model giáo viên có rig với fallback procedural.' },
      { en: 'Vision, AI agent, solar-system learning, PTZ control and digital twin become spatial scenes.', vi: 'Vision, AI agent, mô hình Hệ Mặt Trời, điều khiển PTZ và digital twin trở thành các cảnh không gian.' },
      { en: 'Character detail scales before construction to keep the scene practical across hardware.', vi: 'Độ chi tiết nhân vật được chọn trước khi dựng để cảnh phù hợp với nhiều cấu hình phần cứng.' },
    ],
    links: [
      { label: { en: 'Explore source', vi: 'Xem mã nguồn' }, url: 'https://github.com/minhnhatdepzai/smartroom', kind: 'github' },
    ],
    preview: {
      poster: 'projects/previews/smart-classroom.webp',
      video: 'projects/previews/smart-classroom.mp4',
      alt: { en: 'EduVision AI cinematic 3D classroom with teaching and vision systems.', vi: 'Lớp học 3D cinematic EduVision AI với hệ thống giảng dạy và thị giác.' },
      sourceLabel: { en: 'Product UI walkthrough', vi: 'Video giới thiệu sản phẩm' },
      sourceUrl: 'https://github.com/minhnhatdepzai/smartroom',
    },
  },
  {
    slug: 'kho',
    order: '06',
    year: '2026',
    title: "K’HO DIGITAL HERITAGE",
    eyebrow: { en: 'Cultural storytelling & tourism', vi: 'Kể chuyện văn hóa và du lịch' },
    statement: {
      en: 'A presentation became an atlas, a market and an explorable mountain.',
      vi: 'Một bài thuyết trình trở thành atlas, khu chợ và ngọn núi có thể khám phá.',
    },
    summary: {
      en: 'A source-aware cultural experience that replaces slides with an interactive deck, procedural 3D, sound, a digital passport and a first-person knowledge game.',
      vi: 'Trải nghiệm văn hóa có kiểm soát nguồn, thay slide bằng deck tương tác, 3D procedural, âm thanh, hộ chiếu số và game tri thức góc nhìn thứ nhất.',
    },
    problem: {
      en: 'A conventional slide deck can list cultural facts, but it cannot communicate place, rhythm, sound and participation.',
      vi: 'Slide thông thường có thể liệt kê dữ kiện văn hóa nhưng khó truyền tải không gian, nhịp điệu, âm thanh và sự tham gia.',
    },
    solution: {
      en: 'A multi-mode cultural atlas with sourced chapters, step-based presentation controls, Langbiang scenes, an embedded game and a local-value service model.',
      vi: 'Atlas văn hóa đa chế độ với chương có nguồn, điều khiển theo nhịp, cảnh Langbiang, game nhúng và mô hình dịch vụ tạo giá trị địa phương.',
    },
    contribution: {
      en: 'Creative development, 3D storytelling, cultural data design, interactive presentation and Cloudflare deployment.',
      vi: 'Creative development, kể chuyện 3D, thiết kế dữ liệu văn hóa, trình chiếu tương tác và triển khai Cloudflare.',
    },
    status: 'live',
    statusLabel: { en: 'Live experience', vi: 'Trải nghiệm đang hoạt động' },
    accent: '#d79a35',
    accentSoft: '#e8dec5',
    ink: '#0d1832',
    stack: ['React 19', 'TypeScript', 'Three.js', 'React Three Fiber', 'Web Audio', 'Cloudflare Workers'],
    highlights: [
      { en: 'Cultural atlas, costume, brocade, cuisine, festivals and language sources.', vi: 'Atlas văn hóa, trang phục, thổ cẩm, ẩm thực, lễ hội và nguồn ngôn ngữ.' },
      { en: 'Procedural Langbiang landscape and K’Lang–Hơ Biang legend staging.', vi: 'Địa hình Langbiang procedural và sân khấu truyền thuyết K’Lang–Hơ Biang.' },
      { en: 'First-person world with knowledge gates and collectible Flagcards.', vi: 'Thế giới góc nhìn thứ nhất với cổng tri thức và Flagcard sưu tầm.' },
      { en: 'Digital passport, trip planning and a 3D brocade service layer.', vi: 'Hộ chiếu số, lập hành trình và lớp dịch vụ thổ cẩm 3D.' },
    ],
    links: [
      { label: { en: 'Open live experience', vi: 'Mở trải nghiệm' }, url: 'https://k-ho.lnhat1938.workers.dev/', kind: 'demo' },
      { label: { en: 'Explore source', vi: 'Xem mã nguồn' }, url: 'https://github.com/minhnhatdepzai/K-ho', kind: 'github' },
    ],
    preview: {
      poster: 'projects/previews/kho.webp',
      video: 'projects/previews/kho.mp4',
      alt: { en: 'K Ho Digital Heritage live experience presenting its cultural atlas and mountain story.', vi: 'Trải nghiệm K Ho Digital Heritage giới thiệu atlas văn hóa và câu chuyện núi rừng.' },
      sourceLabel: { en: 'Live product capture', vi: 'Video quay từ sản phẩm đang chạy' },
      sourceUrl: 'https://k-ho.lnhat1938.workers.dev/',
    },
    media: {
      file: 'projects/kho-live.jpg',
      alt: {
        en: 'Real K’ho Digital Heritage opening screen captured from the live deployment, with cultural photography and presentation controls.',
        vi: 'Màn hình mở đầu K’ho Digital Heritage được chụp trực tiếp từ bản triển khai thật, với ảnh văn hóa và điều khiển trình chiếu.',
      },
      label: { en: 'LIVE SITE CAPTURE', vi: 'ẢNH CHỤP LIVE SITE' },
      source: 'k-ho.lnhat1938.workers.dev',
    },
  },
  {
    slug: 'picko247',
    order: '07',
    year: '2026',
    title: 'PICKO 247',
    eyebrow: { en: 'Sports, data & play', vi: 'Thể thao, dữ liệu và game' },
    statement: {
      en: 'The match keeps moving — even while the crowd plays.',
      vi: 'Trận đấu vẫn tiếp diễn — ngay cả khi khán giả đang chơi.',
    },
    summary: {
      en: 'A Pickleball sports-and-play hub combining live tournament storytelling, computed brackets, fan competition and a Three.js rally game.',
      vi: 'Sports & Play Hub cho Pickleball kết hợp diễn biến giải đấu, bracket tính từ kết quả, thi đua khán giả và game Rally 247 bằng Three.js.',
    },
    problem: {
      en: 'Tournament viewers lose momentum between matches and most event sites separate spectators, scores and play.',
      vi: 'Khán giả dễ mất nhịp giữa các trận, trong khi phần lớn website giải đấu tách rời người xem, tỉ số và hoạt động chơi.',
    },
    solution: {
      en: 'A continuous loop from live match to countdown, game overlay, saved fan score, leaderboard and automatic tournament advancement.',
      vi: 'Một vòng liên tục từ trận live tới countdown, game overlay, lưu điểm fan, leaderboard và tự động đẩy đội thắng vào vòng sau.',
    },
    contribution: {
      en: 'Product architecture, tournament state, 3D game integration, responsive interaction and static demo deployment.',
      vi: 'Kiến trúc sản phẩm, trạng thái giải đấu, tích hợp game 3D, tương tác responsive và triển khai demo tĩnh.',
    },
    status: 'live',
    statusLabel: { en: 'Live demo', vi: 'Demo đang hoạt động' },
    accent: '#a8ff2e',
    accentSoft: '#e1ff98',
    ink: '#07170f',
    stack: ['React 18', 'TypeScript', 'Three.js', 'Web Audio', 'Tailwind CSS', 'Cloudflare Workers'],
    highlights: [
      { en: 'Standings are recomputed from match results instead of hard-coded.', vi: 'Bảng xếp hạng được tính lại từ kết quả thay vì hard-code.' },
      { en: 'Bracket winners advance through explicit next-match relationships.', vi: 'Đội thắng đi tiếp nhờ quan hệ next-match rõ ràng.' },
      { en: 'Rally 247 includes ballistics, an AI opponent and mobile controls.', vi: 'Rally 247 có quỹ đạo bóng, đối thủ AI và điều khiển mobile.' },
      { en: 'The game opens over the event without breaking the spectator journey.', vi: 'Game mở phủ trên sự kiện mà không cắt đứt hành trình người xem.' },
    ],
    links: [
      { label: { en: 'Play the live demo', vi: 'Chơi bản demo' }, url: 'https://pickleball247.senaaifptpolytechnic.workers.dev/', kind: 'demo' },
      { label: { en: 'Explore source', vi: 'Xem mã nguồn' }, url: 'https://github.com/minhnhatdepzai/Pickleball247', kind: 'github' },
    ],
    preview: {
      poster: 'projects/previews/picko247.webp',
      video: 'projects/previews/picko247.mp4',
      alt: { en: 'PICKO 247 sports hub showing its live event dashboard and playable rally game.', vi: 'Sports Hub PICKO 247 hiển thị bảng sự kiện trực tiếp và game rally có thể chơi.' },
      sourceLabel: { en: 'Live product capture', vi: 'Video quay từ sản phẩm đang chạy' },
      sourceUrl: 'https://pickleball247.senaaifptpolytechnic.workers.dev/',
    },
    media: {
      file: 'projects/picko247-live.jpg',
      alt: {
        en: 'Real PICKO247 sports hub captured from the live deployment, showing the event overview, live score and Rally 247 entry point.',
        vi: 'Sports Hub PICKO247 được chụp trực tiếp từ bản triển khai thật, hiển thị tổng quan sự kiện, tỉ số live và lối vào Rally 247.',
      },
      label: { en: 'LIVE SITE CAPTURE', vi: 'ẢNH CHỤP LIVE SITE' },
      source: 'pickleball247.senaaifptpolytechnic.workers.dev',
    },
  },
  {
    slug: 'happytoplay',
    order: '08',
    year: '2026',
    title: 'HAPPYTOPLAY',
    eyebrow: { en: 'Inclusive social game hub', vi: 'Nền tảng social game hòa nhập' },
    statement: {
      en: 'Play, speak, sign and belong in the same room.',
      vi: 'Chơi, trò chuyện, ra dấu và kết nối trong cùng một căn phòng.',
    },
    summary: {
      en: 'A Game Jam social hub with voice rooms, community systems, 2D/3D mini-games and accessibility experiments for speech and hand signs.',
      vi: 'Social hub từ Game Jam với phòng thoại, hệ thống cộng đồng, mini-game 2D/3D và thử nghiệm accessibility cho giọng nói lẫn cử chỉ tay.',
    },
    problem: {
      en: 'Social game experiences often treat accessibility as a separate utility instead of part of play and communication.',
      vi: 'Nhiều sản phẩm social game xem accessibility như công cụ rời thay vì một phần của giao tiếp và chơi.',
    },
    solution: {
      en: 'A mobile-shaped social space combining rooms, profiles, games, sign phrases, browser speech and local-first fallbacks.',
      vi: 'Không gian social dạng mobile kết hợp phòng, hồ sơ, game, cụm từ ký hiệu, browser speech và đường lùi local-first.',
    },
    contribution: {
      en: 'Front-end experience, game integration, accessibility experiments and local/backend fallback flows.',
      vi: 'Trải nghiệm front-end, tích hợp game, thử nghiệm accessibility và luồng fallback local/backend.',
    },
    status: 'source',
    statusLabel: { en: 'Source available · demo pending', vi: 'Có mã nguồn · đang chờ demo' },
    accent: '#ff6e91',
    accentSoft: '#42d9e8',
    ink: '#251226',
    stack: ['React 19', 'TypeScript', 'Three.js', 'Motion', 'Flask', 'Web Speech', 'MediaPipe'],
    highlights: [
      { en: 'Voice rooms, messages, profiles, rewards and leaderboards.', vi: 'Phòng thoại, tin nhắn, hồ sơ, phần thưởng và bảng xếp hạng.' },
      { en: 'A collection of 2D, 3D, microphone and hand-controlled games.', vi: 'Bộ game 2D, 3D, microphone và điều khiển bằng tay.' },
      { en: 'Sign-phrase and speech tools are labeled as browser/local experiments.', vi: 'Công cụ cụm từ ký hiệu và giọng nói được ghi rõ là thử nghiệm browser/local.' },
      { en: 'The app remains explorable through mock/local fallbacks when services are offline.', vi: 'Ứng dụng vẫn khám phá được nhờ fallback mock/local khi service chưa chạy.' },
    ],
    links: [
      { label: { en: 'Explore source', vi: 'Xem mã nguồn' }, url: 'https://github.com/minhnhatdepzai/GameJamFPTPolytechnic', kind: 'github' },
    ],
    preview: {
      poster: 'projects/previews/happytoplay.webp',
      video: 'projects/previews/happytoplay.mp4',
      alt: { en: 'HappyToPlay inclusive social game hub with rooms, rewards and accessible games.', vi: 'Nền tảng game hòa nhập HappyToPlay với phòng chơi, phần thưởng và game dễ tiếp cận.' },
      sourceLabel: { en: 'Product UI walkthrough', vi: 'Video giới thiệu giao diện sản phẩm' },
      sourceUrl: 'https://github.com/minhnhatdepzai/GameJamFPTPolytechnic',
    },
  },
  {
    slug: 'vehicle-counting',
    order: '09',
    year: '2026',
    title: 'VEHICLE COUNTING',
    eyebrow: { en: 'Computer vision traffic prototype', vi: 'Prototype thị giác máy tính giao thông' },
    statement: {
      en: 'Detect the road. Track the motion. Count each crossing once.',
      vi: 'Nhận diện mặt đường. Theo dõi chuyển động. Đếm mỗi lượt cắt qua đúng một lần.',
    },
    summary: {
      en: 'A documented computer-vision prototype for detecting and tracking people and vehicle classes in video, then counting directional crossings and exporting annotated results.',
      vi: 'Prototype thị giác máy tính có tài liệu hướng dẫn để nhận diện và theo dõi người cùng các nhóm phương tiện trong video, đếm lượt cắt theo hướng và xuất kết quả đã chú thích.',
    },
    problem: {
      en: 'Frame-by-frame detections alone double-count moving objects and do not explain traffic direction.',
      vi: 'Nhận diện từng khung hình riêng lẻ dễ đếm trùng vật thể đang di chuyển và không cho biết hướng giao thông.',
    },
    solution: {
      en: 'YOLOv8 detections are persisted with ByteTrack IDs and evaluated against a line zone, with separate per-class up/down totals.',
      vi: 'Kết quả YOLOv8 được duy trì bằng ID ByteTrack và kiểm tra qua line zone, với tổng lượt lên/xuống riêng cho từng lớp.',
    },
    contribution: {
      en: 'Prototype design, detection/tracking pipeline, directional counting logic, annotations and reproducible setup guide.',
      vi: 'Thiết kế prototype, pipeline nhận diện/theo dõi, logic đếm theo hướng, lớp chú thích và hướng dẫn thiết lập có thể lặp lại.',
    },
    status: 'source',
    statusLabel: { en: 'Public prototype guide', vi: 'Hướng dẫn prototype công khai' },
    accent: '#ff7a31',
    accentSoft: '#d8e0e2',
    ink: '#142024',
    stack: ['Python', 'YOLOv8', 'ByteTrack', 'OpenCV', 'Supervision', 'NumPy'],
    highlights: [
      { en: 'Tracks people, bicycles, cars, motorcycles, buses and trucks.', vi: 'Theo dõi người, xe đạp, ô tô, xe máy, xe buýt và xe tải.' },
      { en: 'Persistent tracker IDs prevent repeat counts for the same crossing direction.', vi: 'ID theo dõi được duy trì để tránh đếm lặp cùng một hướng cắt.' },
      { en: 'Annotated MP4 output includes boxes, traces, labels, the line zone and live totals.', vi: 'Video MP4 đầu ra có bounding box, vệt di chuyển, nhãn, line zone và tổng đếm trực tiếp.' },
      { en: 'The current repository is a compact implementation guide, not a packaged production service.', vi: 'Repository hiện là hướng dẫn triển khai gọn, chưa phải dịch vụ production đóng gói.' },
    ],
    links: [
      { label: { en: 'Open prototype guide', vi: 'Mở hướng dẫn prototype' }, url: 'https://github.com/minhnhatdepzai/Count_vehicles', kind: 'github' },
    ],
    preview: {
      poster: 'projects/previews/vehicle-counting.webp',
      video: 'projects/previews/vehicle-counting.mp4',
      alt: { en: 'Vehicle Counting pipeline walkthrough with tracked vehicles, crossing line and live totals.', vi: 'Video quy trình Vehicle Counting với phương tiện được theo dõi, vạch đếm và tổng số trực tiếp.' },
      sourceLabel: { en: 'Verified pipeline walkthrough', vi: 'Video giới thiệu pipeline đã kiểm chứng' },
      sourceUrl: 'https://github.com/minhnhatdepzai/Count_vehicles',
    },
  },
  {
    slug: 'task1-coach',
    order: '10',
    year: '2026',
    title: 'TASK1 COACH',
    eyebrow: { en: 'Local-first IELTS practice workspace', vi: 'Không gian luyện IELTS local-first' },
    statement: {
      en: 'Four skills, one calm place to practise and keep moving.',
      vi: 'Bốn kỹ năng, một không gian tập trung để luyện tập và tiến bộ mỗi ngày.',
    },
    summary: {
      en: 'A responsive English-learning workspace that brings vocabulary, grammar, writing, Reading, Listening and Speaking practice together with private on-device progress.',
      vi: 'Không gian học tiếng Anh responsive kết nối từ vựng, ngữ pháp, Writing, Reading, Listening và Speaking với tiến độ được lưu riêng trên thiết bị.',
    },
    problem: {
      en: 'Learners often split practice across disconnected documents, audio players and note apps, making progress difficult to resume and review.',
      vi: 'Người học thường phải chia bài luyện giữa tài liệu, trình phát âm thanh và ứng dụng ghi chú rời rạc, khiến tiến độ khó tiếp tục và ôn lại.',
    },
    solution: {
      en: 'A single local-first web experience combines structured lessons, playback, timers, notes, recording, instant feedback and portable progress backups without requiring an account.',
      vi: 'Một trải nghiệm web local-first hợp nhất bài học có cấu trúc, phát audio, đồng hồ, ghi chú, ghi âm, phản hồi tức thì và sao lưu tiến độ mà không cần tài khoản.',
    },
    contribution: {
      en: 'Source reconstruction and product expansion, learning-content architecture, responsive interaction, local persistence, browser regression coverage and GitHub Pages delivery.',
      vi: 'Tái dựng và mở rộng mã nguồn, kiến trúc nội dung học, tương tác responsive, lưu trữ local, kiểm thử hồi quy trình duyệt và triển khai GitHub Pages.',
    },
    status: 'live',
    statusLabel: { en: 'Live learning experience', vi: 'Trải nghiệm học đang hoạt động' },
    accent: '#7357e8',
    accentSoft: '#eee9ff',
    ink: '#20164a',
    stack: ['React 19', 'TypeScript', 'Expo', 'Playwright', 'IndexedDB', 'GitHub Pages'],
    highlights: [
      { en: 'Vocabulary, grammar and all four language skills share one responsive workspace.', vi: 'Từ vựng, ngữ pháp và cả bốn kỹ năng nằm trong một không gian responsive thống nhất.' },
      { en: 'Thirty Reading lessons, thirty Listening lessons, thirty Speaking topics and thirty-one Writing prompts provide a broad practice path.', vi: '30 bài Reading, 30 bài Listening, 30 chủ đề Speaking và 31 đề Writing tạo thành lộ trình luyện tập đa dạng.' },
      { en: 'Drafts, answers, playback positions, recordings and preferences stay on the learner’s device, with JSON backup and restore.', vi: 'Bản nháp, đáp án, vị trí nghe, bản ghi và tùy chọn được lưu trên thiết bị, kèm sao lưu và khôi phục JSON.' },
      { en: 'Production-browser checks cover responsive layouts, real audio playback, persistence, reduced motion and keyboard-friendly interaction.', vi: 'Kiểm thử trên bản production bao phủ responsive, phát audio thật, lưu tiến độ, reduced motion và tương tác thân thiện với bàn phím.' },
    ],
    links: [
      { label: { en: 'Open live learning app', vi: 'Mở web học trực tiếp' }, url: 'https://minhnhatdepzai.github.io/task1-coach-pages/#home', kind: 'demo' },
      { label: { en: 'Open GitHub repository', vi: 'Mở repository GitHub' }, url: 'https://github.com/minhnhatdepzai/task1-coach-pages', kind: 'github' },
    ],
    preview: {
      poster: 'projects/previews/task1-coach.webp',
      video: 'projects/previews/task1-coach.mp4',
      alt: { en: 'Task1 Coach live IELTS workspace moving through lessons and practice tools.', vi: 'Không gian IELTS Task1 Coach đang chạy với các bài học và công cụ luyện tập.' },
      sourceLabel: { en: 'Live learning app capture', vi: 'Video quay từ ứng dụng học đang chạy' },
      sourceUrl: 'https://minhnhatdepzai.github.io/task1-coach-pages/#home',
    },
    media: {
      file: 'projects/task1-coach-live.webp',
      alt: {
        en: 'Live Task1 Coach Listening room showing the responsive learning navigation, listening practice hero and lesson cards.',
        vi: 'Phòng luyện nghe Task1 Coach trên bản live, với điều hướng học tập responsive, phần giới thiệu Listening và các thẻ bài luyện.',
      },
      label: { en: 'LIVE LEARNING WORKSPACE', vi: 'KHÔNG GIAN HỌC ĐANG HOẠT ĐỘNG' },
      source: 'minhnhatdepzai.github.io/task1-coach-pages',
    },
  },
  {
    slug: 'hostora-ai',
    order: '11',
    year: '2026',
    title: 'HOSTORA AI',
    eyebrow: { en: 'Local-first AI commerce platform', vi: 'Nền tảng bán hàng AI local-first' },
    statement: {
      en: 'One commerce core for customers, operators and a grounded AI assistant.',
      vi: 'Một lõi thương mại cho khách hàng, đội vận hành và trợ lý AI có căn cứ.',
    },
    summary: {
      en: 'A full-stack commerce product connecting a Next.js storefront, Android app, admin operations and a shared backend with local AI services.',
      vi: 'Sản phẩm thương mại full-stack kết nối storefront Next.js, ứng dụng Android, trang quản trị và backend dùng chung với các dịch vụ AI chạy local.',
    },
    problem: {
      en: 'Commerce experiences drift when customer, mobile and admin surfaces each invent their own catalog, pricing and support answers.',
      vi: 'Trải nghiệm bán hàng dễ lệch khi giao diện khách hàng, mobile và quản trị tự dùng danh mục, giá và câu trả lời hỗ trợ riêng.',
    },
    solution: {
      en: 'Shared product data and commerce rules keep every surface aligned, while structured Qwen extraction and source-aware retrieval constrain the assistant to grounded catalog and pricing facts.',
      vi: 'Dữ liệu sản phẩm và luật thương mại dùng chung giữ mọi giao diện nhất quán; Qwen trích xuất có cấu trúc và truy xuất theo nguồn giới hạn trợ lý trong thông tin danh mục, giá đã có căn cứ.',
    },
    contribution: {
      en: 'Product architecture, customer and admin web, Android integration, local model serving, retrieval, quality gates and deployment workflows.',
      vi: 'Kiến trúc sản phẩm, web khách hàng và quản trị, tích hợp Android, phục vụ model local, truy xuất, cổng chất lượng và quy trình triển khai.',
    },
    status: 'source',
    statusLabel: { en: 'Public source · local AI runtime', vi: 'Mã nguồn công khai · AI chạy local' },
    accent: '#3f6f56',
    accentSoft: '#dce8da',
    ink: '#12251b',
    stack: ['Next.js', 'React', 'TypeScript', 'Expo', 'React Native', 'SQLite', 'Ollama', 'Qwen3.5', 'RAG', 'Docker'],
    highlights: [
      { en: 'Customer web, Android and admin operate on one shared commerce backend.', vi: 'Web khách hàng, Android và admin vận hành trên cùng một backend thương mại.' },
      { en: 'The deployed chatbot is versioned separately from candidate Studio adapters.', vi: 'Chatbot đã triển khai được quản lý phiên bản riêng với các adapter Studio đang thử nghiệm.' },
      { en: 'Catalog and pricing answers remain tied to source data instead of model memory.', vi: 'Câu trả lời về danh mục và giá luôn bám dữ liệu nguồn thay vì trí nhớ của model.' },
      { en: 'Local model serving keeps the AI stack inspectable and under operator control.', vi: 'Model chạy local giúp toàn bộ AI stack có thể kiểm tra và nằm trong quyền kiểm soát của người vận hành.' },
    ],
    links: [
      { label: { en: 'Open GitHub repository', vi: 'Mở repository GitHub' }, url: 'https://github.com/minhnhatdepzai/HOSTORA-AI', kind: 'github' },
    ],
    preview: {
      poster: 'projects/previews/hostora-ai.webp',
      video: 'projects/previews/hostora-ai.mp4',
      alt: { en: 'HOSTORA AI commerce platform showing its customer and AI shopping experience.', vi: 'Nền tảng thương mại HOSTORA AI hiển thị trải nghiệm mua sắm và trợ lý AI.' },
      sourceLabel: { en: 'Real HOSTORA demo', vi: 'Demo HOSTORA thật' },
      sourceUrl: 'https://youtu.be/-17sYrbp7pU',
    },
  },
  {
    slug: 'vocalab',
    order: '12',
    year: '2026',
    title: 'VOCALAB',
    eyebrow: { en: 'Consent-gated local voice studio', vi: 'Studio giọng nói local có kiểm soát đồng thuận' },
    statement: {
      en: 'Prepare, adapt and evaluate a voice locally — with provenance attached.',
      vi: 'Chuẩn bị, tinh chỉnh và đánh giá giọng nói ngay trên máy — luôn kèm nguồn gốc.',
    },
    summary: {
      en: 'A local voice-AI workspace for dataset preparation, VieNeu-TTS speaker-adapter fine-tuning, transcription, media cleanup and provenance-aware output.',
      vi: 'Không gian AI giọng nói chạy local để chuẩn bị dataset, fine-tune speaker adapter VieNeu-TTS, phiên âm, làm sạch media và xuất kết quả có ghi nguồn gốc.',
    },
    problem: {
      en: 'Voice experiments become risky and irreproducible when consent, source audio, adapter versions and generated output are mixed together.',
      vi: 'Thử nghiệm giọng nói trở nên rủi ro và khó tái lập khi đồng thuận, audio nguồn, phiên bản adapter và đầu ra tổng hợp bị trộn lẫn.',
    },
    solution: {
      en: 'A queued FastAPI pipeline separates preparation, training and synthesis, records provenance and constrains the workflow to consented or synthetic identity-free material.',
      vi: 'Pipeline FastAPI có hàng đợi tách riêng khâu chuẩn bị, huấn luyện và tổng hợp, ghi provenance và giới hạn quy trình trong dữ liệu đã đồng thuận hoặc dữ liệu tổng hợp không gắn danh tính.',
    },
    contribution: {
      en: 'Voice-data pipeline, LoRA training workflow, media processing, API jobs, safety constraints, evaluation artifacts and local deployment.',
      vi: 'Pipeline dữ liệu giọng nói, quy trình huấn luyện LoRA, xử lý media, API job, ràng buộc an toàn, artifact đánh giá và triển khai local.',
    },
    status: 'source',
    statusLabel: { en: 'Public source · local GPU studio', vi: 'Mã nguồn công khai · studio GPU local' },
    accent: '#b34d6d',
    accentSoft: '#f1d9df',
    ink: '#35121f',
    stack: ['React 19', 'FastAPI', 'FFmpeg', 'faster-whisper', 'VieNeu-TTS', 'LoRA', 'PyTorch', 'Docker'],
    highlights: [
      { en: 'Fine-tunes speaker adapters for VieNeu-TTS instead of retraining the base model.', vi: 'Fine-tune speaker adapter cho VieNeu-TTS thay vì huấn luyện lại base model.' },
      { en: 'Fifteen released adapters are tracked as concrete training artifacts.', vi: '15 adapter đã phát hành được theo dõi như artifact huấn luyện cụ thể.' },
      { en: 'Transcription, separation and cleanup are explicit pretrained processing stages, not claimed as new models.', vi: 'Phiên âm, tách nguồn và làm sạch là các bước xử lý pretrained rõ ràng, không được nhận là model mới.' },
      { en: 'Consent and generated-media provenance are enforced as part of the product workflow.', vi: 'Đồng thuận và provenance của media tổng hợp được áp dụng ngay trong quy trình sản phẩm.' },
    ],
    links: [
      { label: { en: 'Open GitHub repository', vi: 'Mở repository GitHub' }, url: 'https://github.com/minhnhatdepzai/voice-deeplearning', kind: 'github' },
    ],
    preview: {
      poster: 'projects/previews/vocalab.webp',
      video: 'projects/previews/vocalab.mp4',
      alt: { en: 'Vocalab local studio interface showing its consent-gated synthetic voice workflow.', vi: 'Giao diện studio Vocalab hiển thị quy trình giọng nói tổng hợp local có kiểm soát đồng thuận.' },
      sourceLabel: { en: 'Safe local studio walkthrough', vi: 'Video giới thiệu studio local an toàn' },
      sourceUrl: 'https://github.com/minhnhatdepzai/voice-deeplearning',
    },
  },
  {
    slug: 'vector-vu-tru',
    order: '13',
    year: '2026',
    title: 'VECTOR VŨ TRỤ',
    eyebrow: { en: 'Browser-native cockpit shooter', vi: 'Game bắn phi thuyền góc lái trên trình duyệt' },
    statement: {
      en: 'Launch from the cockpit. Read the field. Break through the campaign.',
      vi: 'Cất cánh từ buồng lái. Đọc chiến trường. Vượt qua toàn bộ chiến dịch.',
    },
    summary: {
      en: 'A Three.js vertical campaign with a first-person cockpit, solo AI opponents, mobile controls and adaptive rendering for the browser.',
      vi: 'Chiến dịch dọc bằng Three.js với buồng lái góc nhìn thứ nhất, đối thủ AI chơi đơn, điều khiển mobile và kết xuất thích ứng trên trình duyệt.',
    },
    problem: {
      en: 'A fast 3D shooter must make combat readable on both desktop and touch devices without overwhelming weaker GPUs.',
      vi: 'Game bắn súng 3D tốc độ cao phải giữ giao tranh dễ đọc trên cả desktop lẫn cảm ứng mà không quá tải GPU yếu.',
    },
    solution: {
      en: 'Procedural space arenas, rule-based enemy behaviors, responsive input and adaptive quality create a complete solo campaign in a lightweight web build.',
      vi: 'Đấu trường không gian procedural, hành vi địch theo luật, input responsive và chất lượng thích ứng tạo thành chiến dịch chơi đơn hoàn chỉnh trong bản web gọn nhẹ.',
    },
    contribution: {
      en: 'Game direction, Three.js rendering, cockpit combat, enemy behavior, campaign progression, touch controls and GitHub Pages delivery.',
      vi: 'Định hướng game, kết xuất Three.js, chiến đấu trong buồng lái, hành vi kẻ địch, tiến trình chiến dịch, điều khiển cảm ứng và triển khai GitHub Pages.',
    },
    status: 'live',
    statusLabel: { en: 'Live playable game', vi: 'Game đang chơi được' },
    accent: '#df5f31',
    accentSoft: '#f3dfbf',
    ink: '#31150c',
    stack: ['JavaScript', 'Three.js', 'WebGL 2', 'Vite', 'GitHub Pages'],
    highlights: [
      { en: 'A full vertical campaign unfolds from a first-person spacecraft cockpit.', vi: 'Chiến dịch dọc hoàn chỉnh diễn ra từ buồng lái phi thuyền góc nhìn thứ nhất.' },
      { en: 'Enemy pilots use hand-authored combat behavior rather than a machine-learning model.', vi: 'Phi công đối thủ dùng hành vi chiến đấu viết tay thay vì model học máy.' },
      { en: 'Touch controls preserve the same campaign on mobile devices.', vi: 'Điều khiển cảm ứng giữ nguyên chiến dịch trên thiết bị mobile.' },
      { en: 'Adaptive rendering scales visual cost for browser hardware.', vi: 'Kết xuất thích ứng điều chỉnh chi phí đồ họa theo phần cứng trình duyệt.' },
    ],
    links: [
      { label: { en: 'Play the game', vi: 'Chơi thử game' }, url: 'https://minhnhatdepzai.github.io/kaga-tama-game/', kind: 'demo' },
      { label: { en: 'Open GitHub repository', vi: 'Mở repository GitHub' }, url: 'https://github.com/minhnhatdepzai/kaga-tama-game', kind: 'github' },
    ],
    preview: {
      poster: 'projects/previews/vector-vu-tru.webp',
      video: 'projects/previews/vector-vu-tru.mp4',
      alt: { en: 'Vector Vu Tru browser game showing a spacecraft combat mission in the Ash Belt.', vi: 'Game trình duyệt Vector Vũ Trụ hiển thị nhiệm vụ chiến đấu phi thuyền tại Vành Đai Tro.' },
      sourceLabel: { en: 'Live game capture', vi: 'Video quay từ game đang chạy' },
      sourceUrl: 'https://minhnhatdepzai.github.io/kaga-tama-game/',
    },
  },
  {
    slug: 'run-fpl',
    order: '14',
    year: '2026',
    title: 'RUN FPL',
    eyebrow: { en: 'Bilingual 3D platform adventure', vi: 'Phiêu lưu platform 3D song ngữ' },
    statement: {
      en: 'Eight worlds, quick runs and progress that stays in your browser.',
      vi: 'Tám thế giới, những lượt chạy gọn và tiến độ được giữ ngay trong trình duyệt.',
    },
    summary: {
      en: 'A bilingual 3D platform game spanning eight worlds, with keyboard and mobile controls plus browser-local progress.',
      vi: 'Game platform 3D song ngữ gồm tám thế giới, hỗ trợ bàn phím, điều khiển mobile và lưu tiến độ ngay trên trình duyệt.',
    },
    problem: {
      en: 'A web platformer needs to remain immediately playable across devices while preserving a meaningful sense of progression without an account system.',
      vi: 'Game platform trên web cần chơi ngay trên nhiều thiết bị nhưng vẫn giữ cảm giác tiến triển rõ ràng mà không cần hệ thống tài khoản.',
    },
    solution: {
      en: 'Compact 3D stages, bilingual interface, virtual joystick and buttons, and localStorage persistence turn the static build into a portable eight-world campaign.',
      vi: 'Màn chơi 3D gọn, giao diện song ngữ, joystick cùng nút ảo và lưu localStorage biến bản build tĩnh thành chiến dịch tám thế giới có thể mang đi.',
    },
    contribution: {
      en: 'World and platform gameplay, responsive controls, bilingual interface, local progression and static deployment.',
      vi: 'Thế giới và gameplay platform, điều khiển responsive, giao diện song ngữ, tiến trình local và triển khai tĩnh.',
    },
    status: 'live',
    statusLabel: { en: 'Live playable game', vi: 'Game đang chơi được' },
    accent: '#34779a',
    accentSoft: '#d7e9e9',
    ink: '#102631',
    stack: ['JavaScript', 'Vite', 'WebGL', 'localStorage', 'GitHub Pages'],
    highlights: [
      { en: 'Eight themed worlds form one continuous browser campaign.', vi: 'Tám thế giới theo chủ đề tạo thành một chiến dịch liền mạch trên trình duyệt.' },
      { en: 'Vietnamese and English are both available throughout the game.', vi: 'Tiếng Việt và tiếng Anh đều có trong toàn bộ trò chơi.' },
      { en: 'A virtual joystick and action buttons make the platforming playable on phones.', vi: 'Joystick ảo và các nút hành động giúp chơi platform trên điện thoại.' },
      { en: 'Progress stays in the browser; there is no backend account or cloud save.', vi: 'Tiến độ nằm trong trình duyệt; không có tài khoản backend hay cloud save.' },
    ],
    links: [
      { label: { en: 'Play the game', vi: 'Chơi thử game' }, url: 'https://minhnhatdepzai.github.io/run-fpl/', kind: 'demo' },
      { label: { en: 'Open GitHub repository', vi: 'Mở repository GitHub' }, url: 'https://github.com/minhnhatdepzai/run-fpl', kind: 'github' },
    ],
    preview: {
      poster: 'projects/previews/run-fpl.webp',
      video: 'projects/previews/run-fpl.mp4',
      alt: { en: 'Run FPL browser adventure showing its colorful 3D platforming world.', vi: 'Game phiêu lưu Run FPL hiển thị thế giới platform 3D đầy màu sắc.' },
      sourceLabel: { en: 'Live game capture', vi: 'Video quay từ game đang chạy' },
      sourceUrl: 'https://minhnhatdepzai.github.io/run-fpl/',
    },
  },
];

export interface ArchiveProject {
  name: string;
  category: 'AI & Vision' | 'Web & Mobile' | 'Games' | 'Security';
  year: string;
  url: string;
}

export const archiveProjects: ArchiveProject[] = [
  { name: 'AI for Deaf People', category: 'AI & Vision', year: '2026', url: 'https://github.com/minhnhatdepzai/AI_for_deaf_people' },
  { name: 'Đại Chiến Ngôn Ngữ', category: 'Games', year: '2026', url: 'https://github.com/minhnhatdepzai/DaiChienNgonNgu' },
  { name: 'Realtime Translation', category: 'AI & Vision', year: '2026', url: 'https://github.com/minhnhatdepzai/translate_web_realtime' },
  { name: 'Face Mask Detection', category: 'AI & Vision', year: '2026', url: 'https://github.com/minhnhatdepzai/Face_mask' },
  { name: 'Face Detection', category: 'AI & Vision', year: '2026', url: 'https://github.com/minhnhatdepzai/Face_detective' },
  { name: 'Pygame Driving', category: 'Games', year: '2026', url: 'https://github.com/minhnhatdepzai/Basic_Python_Pygame_library' },
  { name: 'Broken Authentication', category: 'Security', year: '2026', url: 'https://github.com/minhnhatdepzai/Broken_Authentication' },
  { name: 'Dental Clinic System', category: 'Web & Mobile', year: '2026', url: 'https://github.com/minhnhatdepzai/nhakhoane' },
];
