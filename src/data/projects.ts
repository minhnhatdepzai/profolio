import type { LangStr } from './cv';

export type ProjectStatus = 'live' | 'video' | 'source' | 'private' | 'pending';

export interface ProjectLink {
  label: LangStr;
  url: string;
  kind: 'demo' | 'github' | 'video' | 'showcase';
}

export interface FeaturedProject {
  slug: 'japano' | 'saigon-77' | 'math-lab' | 'smart-classroom' | 'kho' | 'picko247' | 'happytoplay' | 'vehicle-counting';
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
    slug: 'saigon-77',
    order: '02',
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
  },
  {
    slug: 'math-lab',
    order: '03',
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
      en: 'A deterministic scene pipeline with family-specific visual models, shared playback and explicit unsupported fallbacks instead of misleading diagrams.',
      vi: 'Pipeline scene xác định với mô hình trực quan theo từng họ bài, playback dùng chung và fallback rõ ràng thay vì dựng biểu đồ sai nghĩa.',
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
    stack: ['React', 'Three.js', 'Python', 'FastAPI', 'Pydantic', 'SymPy', 'PostgreSQL', 'Redis'],
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
    ],
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
    order: '04',
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
  },
  {
    slug: 'kho',
    order: '05',
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
    order: '06',
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
    order: '07',
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
  },
  {
    slug: 'vehicle-counting',
    order: '08',
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
