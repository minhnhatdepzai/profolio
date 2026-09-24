import type { LangStr } from './cv';
import type { FeaturedProject } from './projects';

// How much machine learning a project really contains. "trained" is reserved for work
// with a real training run, a checkpoint and an evaluation; everything else says what it is.
export type AiDepth = 'trained' | 'pretrained' | 'rules' | 'none';

export interface ProjectModel {
  name: string;
  kind: 'fine-tuned' | 'trained' | 'pilot' | 'pretrained' | 'algorithm';
  role: LangStr;
}

// `name` is the short tag shown on the project card; `detail` is what it did, shown in the case study.
export interface ProjectSkill {
  name: string | LangStr;
  detail: LangStr;
}

export interface SkillGroup {
  title: LangStr;
  ai?: boolean;
  skills: ProjectSkill[];
}

export interface ProjectSkillProfile {
  depth: AiDepth;
  verdict: LangStr;
  models: ProjectModel[];
  groups: SkillGroup[];
}

export const aiDepthLabels: Record<AiDepth, LangStr> = {
  trained: { en: 'AI · trained here', vi: 'AI · tự huấn luyện' },
  pretrained: { en: 'AI · pretrained models', vi: 'AI · model pretrained' },
  rules: { en: 'Rule-based AI · no ML', vi: 'AI theo luật · không ML' },
  none: { en: 'Code-native · no AI model', vi: 'Thuần code · không model AI' },
};

export const modelKindLabels: Record<ProjectModel['kind'], LangStr> = {
  'fine-tuned': { en: 'Fine-tuned here', vi: 'Tự fine-tune' },
  trained: { en: 'Trained here', vi: 'Tự huấn luyện' },
  pilot: { en: 'Pilot run · not deployed', vi: 'Chạy thử · chưa triển khai' },
  pretrained: { en: 'Pretrained · inference', vi: 'Pretrained · suy luận' },
  algorithm: { en: 'Algorithm · no weights', vi: 'Thuật toán · không trọng số' },
};

export const countSkills = (profile: ProjectSkillProfile) =>
  profile.groups.reduce((total, group) => total + group.skills.length, 0);

const s = (name: string | LangStr, en: string, vi: string): ProjectSkill => ({ name, detail: { en, vi } });
const g = (en: string, vi: string, skills: ProjectSkill[], ai = false): SkillGroup => ({ title: { en, vi }, ai, skills });
const m = (name: string, kind: ProjectModel['kind'], en: string, vi: string): ProjectModel => ({ name, kind, role: { en, vi } });

export const projectSkills: Record<FeaturedProject['slug'], ProjectSkillProfile> = {
  japano: {
    depth: 'trained',
    verdict: {
      en: 'Yes — one generative model is genuinely fine-tuned here: a rank-8 LoRA on FLUX.2 Klein 4B that simulates tight, regular and loose fit, alongside scikit-learn body estimators trained on ANSUR II. FASHN VTON 1.5, FLUX.2 pose transfer, Wan2.1 motion and the Ollama language models run as inference only, and are labelled that way.',
      vi: 'Có — một model tạo sinh được fine-tune thật trong dự án: LoRA rank 8 trên FLUX.2 Klein 4B mô phỏng chật, vừa, rộng theo size, cùng các bộ ước lượng cơ thể scikit-learn huấn luyện trên ANSUR II. FASHN VTON 1.5, pose transfer FLUX.2, video Wan2.1 và các model ngôn ngữ qua Ollama chỉ chạy suy luận, và được ghi đúng như vậy.',
    },
    models: [
      m('FLUX.2 Klein 4B + LoRA r8', 'fine-tuned',
        'Img2img fit refinement across seven fit classes from good to very loose. Checkpoint 400 accepted; 500 and 600 rejected for artifacts. Off by default and applied to tops only — the domain it was trained on.',
        'Tinh chỉnh độ vừa (img2img) qua bảy lớp từ vừa đến rất rộng. Checkpoint 400 được chấp nhận; 500 và 600 bị loại vì artifact. Mặc định tắt và chỉ áp cho áo — đúng miền dữ liệu đã huấn luyện.'),
      m('Body estimators (scikit-learn)', 'trained',
        'BMI, weight and chest/waist/hip girth regressors trained on ANSUR II and calibrated to BodyM, returning low/high/point intervals instead of a single number.',
        'Bộ hồi quy BMI, cân nặng và vòng ngực/eo/hông huấn luyện trên ANSUR II, hiệu chuẩn theo BodyM, trả về khoảng thấp/cao/điểm thay vì một con số duy nhất.'),
      m('FASHN VTON 1.5', 'pretrained',
        'Main virtual try-on engine. The local release ships inference code only, so fine-tuning it was assessed and ruled out.',
        'Engine thử đồ chính. Bản cục bộ chỉ có mã suy luận nên việc fine-tune đã được đánh giá và loại bỏ.'),
      m('YOLOv8n-pose · U2Net', 'pretrained',
        '17-joint pose picks one main subject in multi-person photos; U2Net salient-object segmentation extracts the body silhouette.',
        'Pose 17 khớp chọn đúng một chủ thể trong ảnh nhiều người; U2Net tách nền để lấy silhouette cơ thể.'),
      m('Wan2.1-T2V-1.3B + One-to-All Animation', 'pretrained',
        'Optional motion video generated from the try-on image, with YOLOv10m + ViTPose (ONNX) pose control. Inference-optimised; no new checkpoint.',
        'Video chuyển động tùy chọn sinh từ ảnh đã thử đồ, điều khiển pose bằng YOLOv10m + ViTPose (ONNX). Tối ưu suy luận, không có checkpoint mới.'),
      m('Qwen2.5 7B · Qwen3-VL 8B (Ollama)', 'pretrained',
        'Rewrite already-grounded drafts and reviews; the vision-language model checks sensitive photos and drafts product descriptions. Neither may invent stock, price or body facts.',
        'Viết lại bản nháp đã có căn cứ và review; model thị giác-ngôn ngữ kiểm tra ảnh nhạy cảm và sinh mô tả sản phẩm. Không model nào được bịa tồn kho, giá hay số đo cơ thể.'),
      m('Hybrid recommender (Node, CPU)', 'algorithm',
        'Mamba-inspired selective state, LightGCN-style graph propagation, Markov next-item and an adaptive mixture-of-experts — small in-house implementations, not official checkpoints.',
        'Trạng thái chọn lọc lấy cảm hứng Mamba, lan truyền đồ thị kiểu LightGCN, Markov next-item và mixture-of-experts thích ứng — implementation nhỏ tự viết, không phải checkpoint chính thức.'),
    ],
    groups: [
      g('Fine-tuning & training', 'Fine-tune & huấn luyện', [
        s('LoRA', 'Rank-8 / alpha-8 adapter on FLUX.2 Klein 4B that makes the chosen size change the garment’s drape.', 'Adapter rank 8 / alpha 8 trên FLUX.2 Klein 4B giúp size được chọn làm thay đổi độ ôm, rủ của trang phục.'),
        s('DreamBooth img2img', 'Img2img training recipe so the adapter refines an existing try-on instead of generating from scratch.', 'Công thức huấn luyện img2img để adapter tinh chỉnh ảnh thử đồ có sẵn thay vì sinh lại từ đầu.'),
        s('Hugging Face diffusers', 'Training and inference loop for the FLUX.2 adapter.', 'Vòng huấn luyện và suy luận cho adapter FLUX.2.'),
        s('PyTorch · CUDA', '512 px, 600 steps at LR 1e-4, seed 17 — 80.3 minutes at 15.2 GB peak VRAM.', '512 px, 600 bước với LR 1e-4, seed 17 — 80,3 phút, đỉnh VRAM 15,2 GB.'),
        s('BF16 · gradient checkpointing', 'Mixed precision and activation recomputation to fit a 4B diffusion model on a 16 GB card.', 'Độ chính xác hỗn hợp và tính lại activation để model diffusion 4B vừa với card 16 GB.'),
        s('8-bit Adam', 'Optimiser states kept in 8 bits to free VRAM for the model.', 'Trạng thái optimizer lưu 8 bit để dành VRAM cho model.'),
        s('Latent caching · CPU offload', 'VAE latents cached once and idle modules moved to CPU during training.', 'Cache latent VAE một lần và chuyển module không dùng sang CPU khi train.'),
        s('Gradient accumulation', 'Batch 1 × 4 accumulation steps for a stable effective batch.', 'Batch 1 × 4 bước tích lũy để có batch hiệu dụng ổn định.'),
        s({ en: 'Pilot runs', vi: 'Chạy pilot' }, '14–28 samples at 20–50 steps prove real backward passes, finite loss and a reloadable checkpoint before GPU hours are spent.', '14–28 mẫu với 20–50 bước chứng minh backward thật, loss hữu hạn và checkpoint nạp lại được trước khi tốn giờ GPU.'),
        s({ en: 'Identity-split data', vi: 'Chia dữ liệu theo danh tính' }, 'VITON-HD, 116 samples from 21 people in seven fit classes, split 81 / 18 / 17 by identity so nobody leaks across splits.', 'VITON-HD, 116 mẫu từ 21 người trong bảy lớp độ vừa, chia 81 / 18 / 17 theo danh tính để không ai lọt giữa các tập.'),
        s({ en: 'Checkpoint acceptance gate', vi: 'Cổng chấp nhận checkpoint' }, 'Checkpoint 400 raised fit-structure change from 16.7 to 19.1 at equal body drift; 500 and 600 were rejected for artifacts.', 'Checkpoint 400 tăng mức thay đổi cấu trúc độ vừa từ 16,7 lên 19,1 với body drift không đổi; 500 và 600 bị loại vì artifact.'),
        s('scikit-learn', 'BMI, weight and girth regressors trained on ANSUR II and calibrated to BodyM.', 'Bộ hồi quy BMI, cân nặng và số đo vòng huấn luyện trên ANSUR II, hiệu chuẩn theo BodyM.'),
        s({ en: 'Dataset licensing', vi: 'Giấy phép dữ liệu' }, 'Non-commercial VITON-HD and BodyM terms are tracked and inherited by every derived checkpoint; CC0 ANSUR II stays unrestricted.', 'Điều khoản phi thương mại của VITON-HD và BodyM được theo dõi và kế thừa cho mọi checkpoint phái sinh; ANSUR II CC0 không bị ràng buộc.'),
      ], true),
      g('Generative AI & LLMs', 'AI tạo sinh & LLM', [
        s('FASHN VTON 1.5', 'Main virtual try-on engine on real customer photos.', 'Engine thử đồ chính trên ảnh thật của khách.'),
        s('FLUX.2 Klein 4B', 'Pose transfer for difficult photos, accessory refinement and multi-reference two-piece garments.', 'Pose transfer cho ảnh khó, tinh chỉnh phụ kiện và ghép trang phục hai mảnh đa tham chiếu.'),
        s('Wan2.1 · One-to-All Animation', 'Turns a finished try-on into a short “living photo” video.', 'Biến ảnh thử đồ hoàn chỉnh thành video “ảnh sống” ngắn.'),
        s('Qwen3-VL 8B', 'Vision-language model that screens sensitive photos and drafts product descriptions from images.', 'Model thị giác-ngôn ngữ kiểm tra ảnh nhạy cảm và sinh mô tả sản phẩm từ ảnh.'),
        s('Qwen2.5 7B', 'Rewrites grounded drafts for the Ori assistant and review moderation.', 'Viết lại bản nháp đã có căn cứ cho trợ lý Ori và duyệt review.'),
        s('Ollama', 'Local LLM runtime; every feature falls back to local rules when it is off or the GPU is busy.', 'Runtime LLM local; mọi tính năng lùi về luật cục bộ khi Ollama tắt hoặc GPU bận.'),
        s({ en: 'Grounded chatbot', vi: 'Chatbot có căn cứ' }, 'Ori answers from the real catalogue with multi-turn memory and never invents stock or prices.', 'Ori trả lời từ catalog thật, nhớ nhiều lượt và không bịa tồn kho hay giá.'),
        s({ en: 'GPU arbitration', vi: 'Điều phối GPU' }, 'An arbiter loads and releases models by product focus so try-on, video and LLMs share one card.', 'Arbiter nạp và nhả model theo ngữ cảnh để thử đồ, video và LLM dùng chung một card.'),
        s({ en: 'Async AI job queue', vi: 'Hàng đợi AI bất đồng bộ' }, 'queued → running → completed / failed / cancelled, so a one-minute try-on never blocks a request and shows no fake progress bar.', 'queued → running → completed / failed / cancelled, để lượt thử đồ một phút không treo request và không hiện thanh phần trăm giả.'),
        s('P50 / P95 latency', 'Cold vs warm timing per stage — 88.2 s cold start vs 36.0 s warm for the two-piece flow.', 'Đo lúc nguội và lúc nóng theo từng bước — 88,2 s khởi động nguội so với 36,0 s khi nóng ở luồng hai mảnh.'),
      ], true),
      g('Computer vision', 'Thị giác máy tính', [
        s('YOLOv8n-pose', '17 body keypoints; picks the largest, closest person in multi-person photos.', '17 điểm khớp cơ thể; chọn người lớn và gần nhất trong ảnh nhiều người.'),
        s('U2Net', 'Salient-object segmentation for the body silhouette.', 'Tách nền đối tượng nổi bật để lấy silhouette cơ thể.'),
        s('YOLOv10m · ViTPose', 'Pose control and action checks for the motion video.', 'Điều khiển pose và kiểm tra động tác cho video chuyển động.'),
        s('ONNX Runtime', 'Runs the pose models used by the motion pipeline.', 'Chạy các model pose dùng trong pipeline video.'),
        s({ en: 'Body measurement estimation', vi: 'Ước lượng số đo cơ thể' }, 'Height, weight and girths as ranges with confidence; out-of-distribution photos rejected; user input always wins.', 'Chiều cao, cân nặng và vòng đo dạng khoảng kèm độ tin cậy; ảnh ngoài phân phối bị từ chối; số người dùng nhập luôn được ưu tiên.'),
        s({ en: 'Image quality gate', vi: 'Quality gate ảnh' }, 'Withholds a result when identity, body structure or garment category drifts.', 'Giữ lại kết quả khi danh tính, cấu trúc cơ thể hoặc loại trang phục bị lệch.'),
      ], true),
      g('Recommendation & analytics', 'Gợi ý & phân tích', [
        s({ en: 'Hybrid recommender', vi: 'Hệ gợi ý lai' }, 'Matrix factorisation, item-CF cosine, content tags and market-basket signals in pure Node on CPU.', 'Matrix factorization, item-CF cosine, tag nội dung và giỏ hàng, chạy thuần Node trên CPU.'),
        s('Mamba-inspired SSM', 'A 12-dimensional event-gated selective state over up to 64 behaviours per user.', 'Trạng thái chọn lọc 12 chiều, gate theo sự kiện, trên tối đa 64 hành vi mỗi người dùng.'),
        s('LightGCN-style graph', 'Two propagation layers over the user–item graph.', 'Hai lớp lan truyền trên đồ thị người dùng–sản phẩm.'),
        s('Mixture of Experts', 'Expert weights adapt to how long a user’s history is.', 'Trọng số expert thay đổi theo độ dài lịch sử của người dùng.'),
        s('Markov next-item', 'First-order session transitions with a 72-hour gap limit.', 'Chuyển tiếp phiên bậc một, khoảng cách tối đa 72 giờ.'),
        s('Learning-to-rank', 'Pairwise logistic SGD ranker, evaluated chronologically; unmeasured metrics are reported as not measured.', 'Ranker pairwise logistic SGD đánh giá theo thời gian; chỉ số chưa đo được ghi là chưa đo.'),
        s({ en: 'Negative feedback', vi: 'Phản hồi âm' }, 'Removing from cart or wishlist is learned as a negative signal.', 'Bỏ khỏi giỏ hoặc yêu thích được học như tín hiệu âm.'),
        s({ en: 'Time-series forecasting', vi: 'Dự báo chuỗi thời gian' }, 'Three-month revenue forecast blending OLS, Holt double-exponential and WMA by inverse MAE.', 'Dự báo doanh thu 3 tháng gộp OLS, Holt double-exponential và WMA theo nghịch đảo MAE.'),
        s('K-Means · RFM', 'Customer segments and churn risk on z-score-normalised features.', 'Phân khúc khách hàng và rủi ro churn trên đặc trưng chuẩn hóa z-score.'),
      ], true),
      g('Mobile app', 'Ứng dụng di động', [
        s('React Native', 'Android app (RN 0.74) for shopping, AI try-on, body measurement, stylist, Japan guide and loyalty.', 'Ứng dụng Android (RN 0.74) cho mua sắm, thử đồ AI, đo cơ thể, stylist, cẩm nang Nhật Bản và loyalty.'),
        s('Expo', 'Expo SDK 51 builds and releases, up to version 1.0.19.', 'Build và phát hành bằng Expo SDK 51, tới bản 1.0.19.'),
        s('Expo Router', 'File-based navigation across the app’s modules.', 'Điều hướng theo cấu trúc file giữa các module.'),
        s('SecureStore', 'Keeps session tokens in the device’s secure storage.', 'Lưu token phiên trong vùng lưu trữ an toàn của thiết bị.'),
        s('Push notifications', 'expo-notifications for order and loyalty updates.', 'expo-notifications cho cập nhật đơn hàng và loyalty.'),
        s('Google Sign-In', 'Social login linked to the same account as the website.', 'Đăng nhập Google dùng chung tài khoản với website.'),
        s('Stripe React Native', 'Card and Checkout payments in test mode; VNPay sandbox inside a WebView.', 'Thanh toán thẻ và Checkout ở chế độ test; VNPay sandbox trong WebView.'),
        s({ en: 'Offline resilience', vi: 'Chịu lỗi mạng' }, 'Keeps the last server catalogue, reloads when active, retries every 12 s, and GPU jobs survive the app going to background.', 'Giữ catalog server gần nhất, tải lại khi mở app, thử lại mỗi 12 giây, và job GPU không mất khi app vào nền.'),
      ]),
      g('Web storefront', 'Website bán hàng', [
        s('React 19', 'Standalone storefront on an App Router, with no React Native code shared.', 'Storefront độc lập trên App Router, không dùng chung dòng React Native nào.'),
        s('Vinext · App Router', 'React storefront built with Vinext and deployed through its Cloudflare integration.', 'Storefront React build bằng Vinext và triển khai qua tích hợp Cloudflare.'),
        s('TypeScript', 'Strict mode across the storefront.', 'Chế độ strict trên toàn storefront.'),
        s({ en: 'BFF pattern', vi: 'Kiến trúc BFF' }, 'Same-origin proxy: the browser only sees /api and /media, JWT lives in an HttpOnly cookie and mutations check Origin.', 'Proxy cùng origin: trình duyệt chỉ thấy /api và /media, JWT nằm trong cookie HttpOnly và mutation kiểm tra Origin.'),
        s('TanStack Query', 'Server-state fetching and cache for catalogue, cart and wishlist.', 'Lấy và cache dữ liệu server cho catalog, giỏ và yêu thích.'),
        s('Zod · React Hook Form', 'Schema-validated forms for checkout and account.', 'Form thanh toán và tài khoản có kiểm tra schema.'),
        s('Motion · GSAP', 'Page and product animations; the hero video pauses offscreen and falls back on Data Saver or reduced motion.', 'Hoạt ảnh trang và sản phẩm; video hero dừng khi khuất và lùi về ảnh tĩnh khi bật Data Saver hoặc reduced motion.'),
        s('Tailwind CSS 4', 'Design-system styling for the storefront.', 'Styling theo design system cho storefront.'),
      ]),
      g('Backend & data', 'Backend & dữ liệu', [
        s('Node.js · Express', 'Node 20 REST API split by domain: auth, catalogue, orders, returns, reviews, loyalty, payments, stylist, try-on, push.', 'REST API Node 20 chia theo domain: auth, catalog, đơn, trả hàng, review, loyalty, thanh toán, stylist, thử đồ, push.'),
        s('MongoDB Atlas', 'One source of truth for the app, storefront and admin console.', 'Một nguồn dữ liệu chung cho app, storefront và trang quản trị.'),
        s({ en: 'Server-side pricing', vi: 'Tính giá phía server' }, 'Price, voucher, stock and totals are always recomputed on the server — the client is never trusted.', 'Giá, voucher, tồn kho và tổng tiền luôn tính lại ở server — không tin client.'),
        s('JWT · bcrypt · RBAC', 'customer < staff < admin < super_admin with role middleware on sensitive endpoints.', 'customer < staff < admin < super_admin với middleware phân quyền cho endpoint nhạy cảm.'),
        s('Helmet · rate limiting', 'Security headers and brute-force limits applied only to real credential endpoints.', 'Header bảo mật và giới hạn brute-force chỉ áp cho endpoint nhận thông tin đăng nhập.'),
        s('Stripe · VNPay', 'Payments count as paid only after the real gateway callback; admin reconcile, returns and refunds.', 'Thanh toán chỉ tính là thành công sau callback thật từ cổng; quản trị đối soát, trả hàng và hoàn tiền.'),
        s('Cloudinary', 'Product and try-on media storage.', 'Lưu trữ media sản phẩm và ảnh thử đồ.'),
        s('Pino · Sentry', 'Structured logs and error monitoring.', 'Log có cấu trúc và giám sát lỗi.'),
        s('Nodemailer', 'Transactional email.', 'Email giao dịch.'),
        s({ en: 'Vietnam address data', vi: 'Dữ liệu hành chính VN' }, '34 provinces and 3,321 wards after the 2025 merger, shared by the app and the website.', '34 tỉnh thành và 3.321 phường xã sau sáp nhập 2025, dùng chung cho app và website.'),
      ]),
      g('Operations & quality', 'Vận hành & chất lượng', [
        s({ en: 'Admin console', vi: 'Trang quản trị' }, 'Vanilla HTML/CSS/JS with no build step: KPIs, analytics, model observability, payments and content moderation.', 'HTML/CSS/JS thuần không build: KPI, phân tích, quan sát model, thanh toán và duyệt nội dung.'),
        s('Vitest · Playwright', 'Unit and browser tests for the storefront.', 'Unit test và test trình duyệt cho storefront.'),
        s('Lighthouse', 'Performance and accessibility audits.', 'Kiểm tra hiệu năng và khả năng tiếp cận.'),
        s('systemd · Tailscale', 'GPU services run as user services with remote access over Tailscale.', 'Dịch vụ GPU chạy dạng user service, truy cập từ xa qua Tailscale.'),
        s('Cloudflare Workers', 'Hosts the storefront and the Golden Ticket showcase.', 'Lưu trữ storefront và trang Golden Ticket showcase.'),
      ]),
    ],
  },
  'fanpage-chatbot': {
    depth: 'trained',
    verdict: {
      en: 'Yes — two kinds of training happen here. LoRA and VeRA adapters were fine-tuned on Qwen3-4B-Instruct-2507 with Hugging Face PEFT (VeRA is live), and a YOLO26n detector was trained on 8,323 images across 91 classes. Around them run pretrained models for OCR, everyday-object detection and Vietnamese embeddings, with a 4-bit Ollama build as automatic fallback.',
      vi: 'Có — dự án có hai loại huấn luyện. Adapter LoRA và VeRA được fine-tune trên Qwen3-4B-Instruct-2507 bằng Hugging Face PEFT (VeRA đang chạy), và detector YOLO26n được huấn luyện trên 8.323 ảnh với 91 lớp. Xung quanh là các model pretrained cho OCR, nhận diện đồ vật thông dụng và embedding tiếng Việt, cùng bản Ollama 4-bit làm dự phòng tự động.',
    },
    models: [
      m('Qwen3-4B-Instruct-2507 + VeRA r256', 'fine-tuned',
        'The live model. Only 1.17 M trainable parameters (0.03%); validation loss 3.06 → 2.01 at 11.8 GB peak VRAM. Chosen over LoRA because LoRA contradicted its source in one evaluation scenario.',
        'Model đang chạy. Chỉ 1,17 triệu tham số huấn luyện (0,03%); val loss 3,06 → 2,01, đỉnh VRAM 11,8 GB. Được chọn thay LoRA vì LoRA mâu thuẫn với nguồn ở một kịch bản đánh giá.'),
      m('Qwen3-4B + LoRA r16', 'fine-tuned',
        'Comparison adapter on every attention and MLP projection: 33 M parameters (0.81%), validation loss 3.06 → 1.43 in 321 s at 12.3 GB. Kept as the comparison baseline; not deployed.',
        'Adapter đối chứng trên mọi projection attention và MLP: 33 triệu tham số (0,81%), val loss 3,06 → 1,43 trong 321 s, 12,3 GB. Giữ làm đối chứng, không triển khai.'),
      m('YOLO26n · edu-ent v3', 'trained',
        '91 classes — stationery, classroom furniture, dice faces, chess pieces, 52 playing cards and guitar. Test mAP50 0.930 / mAP50-95 0.803 on 1,149 unseen images; served at 0.6 confidence.',
        '91 lớp — đồ dùng học tập, nội thất lớp học, mặt xúc xắc, quân cờ vua, 52 lá bài và đàn guitar. mAP50 0,930 / mAP50-95 0,803 trên 1.149 ảnh test chưa từng thấy; chạy ở ngưỡng 0,6.'),
      m('YOLO26s (COCO)', 'pretrained',
        '80 everyday object classes with Vietnamese labels, running next to the custom detector.',
        '80 lớp đồ vật thông dụng với nhãn tiếng Việt, chạy song song detector tự huấn luyện.'),
      m('EasyOCR (vi + en)', 'pretrained',
        'Reads text in photos and scanned pages (0.989 match on synthetic text images). OCR text is redacted and treated as data, never as instructions.',
        'Đọc chữ trong ảnh và trang scan (khớp 0,989 trên ảnh chữ tổng hợp). Chữ OCR được che dữ liệu cá nhân và coi là dữ liệu, không bao giờ là lệnh.'),
      m('AITeamVN/Vietnamese_Embedding', 'pretrained',
        'bge-m3 fine-tuned for Vietnamese by its authors — 1024 dimensions, served by the local model server for document retrieval.',
        'bge-m3 đã được nhóm tác giả fine-tune cho tiếng Việt — 1024 chiều, chạy trong model server local để truy xuất tài liệu.'),
      m('Qwen3-4B Q4_K_M (Ollama)', 'pretrained',
        'Automatic fallback when the GPU server fails: 3.9 GB VRAM and p50 0.55 s, but 40/50 passes against 46/50 for the VeRA model — so fallback only.',
        'Dự phòng tự động khi model server lỗi: 3,9 GB VRAM, p50 0,55 s, nhưng chỉ đạt 40/50 so với 46/50 của model VeRA — nên chỉ làm dự phòng.'),
    ],
    groups: [
      g('LLM fine-tuning', 'Fine-tune LLM', [
        s('Qwen3-4B-Instruct', 'Base LLM served locally in bf16 on one GPU (~8 GB).', 'LLM gốc chạy local ở bf16 trên một GPU (~8 GB).'),
        s('PEFT', 'Hugging Face PEFT for both adapters, with the random projections saved into the VeRA adapter.', 'Hugging Face PEFT cho cả hai adapter, ma trận chiếu ngẫu nhiên được lưu kèm adapter VeRA.'),
        s('VeRA', 'r256 on all projections, LR 4e-3 — 1.17 M parameters, validation loss 3.06 → 2.01; the adapter in production.', 'r256 trên mọi projection, LR 4e-3 — 1,17 triệu tham số, val loss 3,06 → 2,01; adapter đang chạy production.'),
        s('LoRA', 'r16 / α32 on q, k, v, o, gate, up and down at LR 1e-4 — 33 M parameters, validation loss 1.43.', 'r16 / α32 trên q, k, v, o, gate, up, down với LR 1e-4 — 33 triệu tham số, val loss 1,43.'),
        s('Supervised fine-tuning (SFT)', '72 Vietnamese conversations (56 / 16) built with the exact production system prompt and real sources.', '72 hội thoại tiếng Việt (56 / 16) dựng với đúng system prompt production và nguồn thật.'),
        s({ en: 'Loss masking', vi: 'Che mặt nạ loss' }, 'Loss computed on assistant tokens only, with the mask checked.', 'Loss chỉ tính trên token assistant, đã kiểm tra mặt nạ.'),
        s('Hugging Face Transformers', 'Model loading and chat templates, including a fix for a Transformers 5 return-type change.', 'Nạp model và chat template, gồm cả bản sửa cho thay đổi kiểu trả về của Transformers 5.'),
        s('BF16 · gradient checkpointing', 'Training on an RTX 5060 Ti 16 GB at 11.8–12.3 GB peak with gradient accumulation 8.', 'Huấn luyện trên RTX 5060 Ti 16 GB, đỉnh 11,8–12,3 GB, gradient accumulation 8.'),
        s('Early stopping', 'Validation every 7 steps with patience 1 to avoid memorising a small dataset.', 'Đánh giá mỗi 7 bước, patience 1 để tránh học thuộc dữ liệu nhỏ.'),
        s({ en: 'Reproducibility', vi: 'Tái lập được' }, 'Base-model revision pinned by commit hash, fixed seed and a training_meta.json per adapter.', 'Khóa phiên bản model gốc theo commit hash, seed cố định và training_meta.json cho mỗi adapter.'),
        s({ en: 'Data curation', vi: 'Chọn lọc dữ liệu' }, 'OASST1 was filtered to Vietnamese, then left out because its unsourced answers would teach the model to assert.', 'OASST1 được lọc tiếng Việt rồi bị loại vì câu trả lời không nguồn sẽ dạy model khẳng định bừa.'),
      ], true),
      g('Evaluation & LLMOps', 'Đánh giá & LLMOps', [
        s({ en: 'Evaluation harness', vi: 'Bộ đánh giá' }, '50 held-out scenarios through the real production pipeline, fixed seed, rule-based scoring.', '50 kịch bản tách riêng chạy qua đúng pipeline production, seed cố định, chấm bằng luật.'),
        s({ en: 'Hallucination metrics', vi: 'Đo mức bịa' }, 'VeRA passed 46 vs 43 for the base model and cut fabrication signals from 7 to 3 at 100% citation.', 'VeRA đạt 46 so với 43 của model gốc, giảm tín hiệu bịa từ 7 xuống 3, trích nguồn 100%.'),
        s({ en: 'Model registry', vi: 'Registry model' }, 'Atomic, file-locked registry: register → attach evaluation → promote only on a passing gate → rollback.', 'Registry ghi nguyên tử có khóa tệp: đăng ký → gắn đánh giá → chỉ promote khi đạt cổng → rollback.'),
        s('OpenAI-compatible API', 'Local model server exposing chat, embeddings and vision endpoints.', 'Model server local mở endpoint chat, embedding và vision.'),
        s('Ollama · Q4_K_M', '4-bit fallback at 3.9 GB; failover measured at 206 ms.', 'Dự phòng 4-bit 3,9 GB; chuyển đổi đo được 206 ms.'),
        s({ en: 'Latency & VRAM profiling', vi: 'Đo độ trễ & VRAM' }, 'p50 / p95 per model; three large photos, 32 embeddings and two LLM turns at once peaked at 13.15 of 16.3 GB.', 'p50 / p95 cho từng model; ba ảnh lớn, 32 embedding và hai lượt LLM cùng lúc đạt đỉnh 13,15 / 16,3 GB.'),
        s('Langfuse', 'Tracing with metadata only — no conversation content collected.', 'Tracing chỉ gửi metadata — không thu thập nội dung hội thoại.'),
        s('Prompt engineering', 'Versioned system prompts, 120–220-word answers for knowledge questions, temperature 0.3.', 'System prompt có phiên bản, câu trả lời kiến thức 120–220 từ, temperature 0,3.'),
      ], true),
      g('RAG & grounding', 'RAG & chống bịa', [
        s('RAG', 'Answers may only state facts from the sourced knowledge base or ingested documents.', 'Câu trả lời chỉ được nêu sự kiện có trong kho kiến thức có nguồn hoặc tài liệu đã nạp.'),
        s('BM25', 'Ranks knowledge entries that match an exact keyword phrase, with or without Vietnamese accents.', 'Xếp hạng mục kiến thức khớp nguyên cụm từ khóa, có dấu hay không dấu đều được.'),
        s('pgvector · HNSW', 'Cosine vector index on PostgreSQL with tuned ef_search and iterative scan.', 'Chỉ mục vector cosine trên PostgreSQL, tinh chỉnh ef_search và iterative scan.'),
        s('Hybrid search · RRF', 'Vector search and full-text search on accent-stripped text fused by Reciprocal Rank Fusion (k = 60).', 'Tìm vector và full-text trên văn bản bỏ dấu, gộp bằng Reciprocal Rank Fusion (k = 60).'),
        s('Vietnamese embeddings', 'AITeamVN bge-m3 model, 1024 dimensions, served locally.', 'Model AITeamVN bge-m3, 1024 chiều, chạy local.'),
        s({ en: 'PDF / Word ingestion', vi: 'Nạp PDF / Word' }, 'pypdfium2 and python-docx into cleaned, page-numbered chunks, with OCR for scanned pages.', 'pypdfium2 và python-docx thành đoạn đã làm sạch có số trang, OCR cho trang scan.'),
        s({ en: 'Similarity calibration', vi: 'Hiệu chỉnh ngưỡng' }, 'A 0.40 floor set from measured relevant and irrelevant scores on an 82-page exam regulation.', 'Ngưỡng 0,40 đặt từ điểm đo thật của đoạn liên quan và không liên quan trên quy chế thi 82 trang.'),
        s({ en: 'Citation enforcement', vi: 'Bắt buộc dẫn nguồn' }, '[n] markers resolve to real links; invalid numbers are removed.', 'Ký hiệu [n] được đổi thành link thật; số không hợp lệ bị xóa.'),
        s({ en: 'Hallucination guardrails', vi: 'Guardrail chống bịa' }, 'Strips invented links, “verified / official” claims, stale “not released yet” lines and self-computed durations.', 'Xóa link bịa, câu tự nhận “đã kiểm chứng / chính thức”, câu “chưa ra mắt” lỗi thời và khoảng thời gian tự tính.'),
        s({ en: 'Deterministic tools', vi: 'Công cụ xác định' }, 'Dates, weekdays in Vietnam time and arithmetic are computed in code, never generated.', 'Ngày, thứ theo giờ Việt Nam và phép tính được tính bằng code, không để model sinh.'),
        s({ en: 'Strict grounding mode', vi: 'Chế độ strict' }, 'Declines unsourced knowledge questions without calling the model.', 'Từ chối câu hỏi kiến thức không có nguồn mà không gọi model.'),
        s({ en: 'Prompt-injection defence', vi: 'Chống chèn lệnh' }, 'Text read from images is treated as data, never as instructions.', 'Chữ đọc từ ảnh được coi là dữ liệu, không bao giờ là lệnh.'),
        s({ en: 'Access control in SQL', vi: 'Phân quyền trong SQL' }, 'Internal documents are filtered inside the query for public channels; public uploads with personal data are refused.', 'Tài liệu nội bộ bị lọc ngay trong truy vấn với kênh công khai; tài liệu công khai có dữ liệu cá nhân bị từ chối.'),
      ], true),
      g('Computer vision', 'Thị giác máy tính', [
        s('YOLO26 · Ultralytics', 'Custom 91-class detector (v3) trained for 100 epochs next to a COCO model.', 'Detector 91 lớp tự huấn luyện (v3) 100 epoch, chạy cạnh model COCO.'),
        s({ en: 'Optimiser diagnosis', vi: 'Chẩn đoán optimizer' }, 'v2 stalled at mAP50 0.797 on an auto-picked AdamW LR 0.000105; v3 trained with MuSGD LR 0.01 and reached 0.930.', 'v2 dừng ở mAP50 0,797 do tự chọn AdamW LR 0,000105; v3 train bằng MuSGD LR 0,01 và đạt 0,930.'),
        s({ en: 'Dataset engineering', vi: 'Xử lý dataset' }, 'Six licensed Kaggle sets, 8,323 images; near-duplicates grouped by source prefix and dHash, mixed polygon labels fixed, weak classes oversampled.', 'Sáu dataset Kaggle có giấy phép, 8.323 ảnh; gom ảnh gần trùng theo tiền tố nguồn và dHash, sửa nhãn đa giác trộn, tăng mẫu lớp yếu.'),
        s({ en: 'mAP evaluation', vi: 'Đánh giá mAP' }, 'Old vs new model on images neither had seen, with per-group precision and recall at 0.6.', 'So model cũ và mới trên ảnh cả hai chưa thấy, precision và recall theo nhóm ở ngưỡng 0,6.'),
        s('EasyOCR', 'Vietnamese + English text from photos and scanned pages.', 'Đọc chữ tiếng Việt + tiếng Anh từ ảnh và trang scan.'),
        s({ en: 'Multimodal context', vi: 'Ngữ cảnh đa phương thức' }, 'OCR text and detected objects join the question; follow-ups keep redacted image context across turns.', 'Chữ OCR và vật thể ghép vào câu hỏi; câu hỏi tiếp giữ ngữ cảnh ảnh đã che dữ liệu qua nhiều lượt.'),
        s('Kaggle API', 'Dataset search and download with safe archive extraction and licence tracking.', 'Tìm và tải dataset, giải nén an toàn và theo dõi giấy phép.'),
      ], true),
      g('Agents & backend', 'Agent & backend', [
        s('LangGraph', 'Conversation graph with a PostgreSQL checkpointer, summaries, human handoff and resume without calling the model twice.', 'Conversation graph với PostgreSQL checkpointer, tóm tắt, chuyển người thật và resume không gọi model lần hai.'),
        s('LangChain', 'OpenAI-compatible model client and message types for the graph.', 'Client model chuẩn OpenAI và kiểu message cho graph.'),
        s('FastAPI', 'Webhook, website chat, image upload and admin endpoints.', 'Endpoint webhook, chat website, tải ảnh và quản trị.'),
        s({ en: 'Webhook security', vi: 'Bảo mật webhook' }, 'X-Hub-Signature-256 verification and idempotent de-duplication.', 'Xác minh X-Hub-Signature-256 và chống trùng lặp idempotent.'),
        s({ en: 'Durable job queue', vi: 'Hàng đợi bền' }, 'PostgreSQL-backed queue and async worker with message debouncing.', 'Hàng đợi trên PostgreSQL và worker bất đồng bộ có gom tin nhắn.'),
        s('Messenger Platform', 'Graph API webhooks and Send API with an allow-list mode and human handoff.', 'Webhook Graph API và Send API với chế độ allowlist và chuyển người thật.'),
        s('async Python · httpx', 'Non-blocking calls to Meta, the model server and image CDNs.', 'Gọi không chặn tới Meta, model server và CDN ảnh.'),
        s('Pydantic', 'Typed settings and request models.', 'Cấu hình và model request có kiểu.'),
        s('SQLAlchemy · Alembic', 'Async ORM and schema migrations.', 'ORM bất đồng bộ và migration schema.'),
        s('PostgreSQL 17', 'Messages, jobs, checkpoints and vectors in one database, migrated by dump/restore.', 'Tin nhắn, job, checkpoint và vector trong một database, chuyển bằng dump/restore.'),
        s('Typer CLI', 'botctl for reviews, training candidates, knowledge, documents, vision and model promotion.', 'botctl cho review, mẫu huấn luyện, kiến thức, tài liệu, vision và promote model.'),
      ]),
      g('Web widget', 'Widget website', [
        s('TypeScript · esbuild', 'Dependency-free embeddable chat widget with image upload.', 'Widget chat nhúng không thư viện runtime, gửi được ảnh.'),
        s({ en: 'HMAC sessions', vi: 'Phiên ký HMAC' }, 'Signed sessions, rate limiting and an origin allow-list.', 'Phiên có chữ ký, giới hạn tần suất và danh sách origin cho phép.'),
        s({ en: 'XSS-safe rendering', vi: 'Hiển thị chống XSS' }, 'Messages rendered with textContent; only safe source links.', 'Tin nhắn hiển thị bằng textContent; chỉ link nguồn an toàn.'),
      ]),
      g('DevOps & quality', 'DevOps & chất lượng', [
        s('Docker Compose', 'Non-root API, worker, migrations and PostgreSQL with health checks.', 'API, worker, migration và PostgreSQL chạy non-root có health check.'),
        s('Cloudflare Tunnel', 'Free HTTPS endpoint for the Messenger webhook.', 'Endpoint HTTPS miễn phí cho webhook Messenger.'),
        s('uv', 'Python dependency management with a lockfile and separate ML extras.', 'Quản lý thư viện Python có lockfile, tách nhóm ML riêng.'),
        s('pytest', '246 tests across graph, grounding, RAG, vision, database flows and privacy.', '246 test phủ graph, grounding, RAG, vision, luồng database và quyền riêng tư.'),
        s('Ruff', 'Lint including security rules.', 'Lint kèm bộ luật bảo mật.'),
        s({ en: 'Privacy by design', vi: 'Quyền riêng tư' }, 'Pseudonymised user IDs, redacted logs, a delete-conversation command and a privacy policy.', 'Ẩn danh ID người dùng, che log, lệnh xóa hội thoại và chính sách quyền riêng tư.'),
      ]),
    ],
  },
  'saigon-77': {
    depth: 'rules',
    verdict: {
      en: 'No machine-learning model. The intelligence is classic game AI written by hand — state-machine NPCs, grid pathfinding, racing and football bots, an opponent that adapts to your record — plus an adaptive-graphics controller that tunes itself from measured frame times.',
      vi: 'Không dùng model học máy. Phần "trí tuệ" là game AI viết tay — NPC theo state machine, tìm đường trên lưới, bot đua xe và bóng đá, đối thủ thích ứng theo thành tích — cùng bộ điều khiển đồ họa tự điều chỉnh theo thời gian khung hình đo được.',
    },
    models: [
      m('NPC & bot state machines', 'algorithm',
        'Provoked NPCs pursue, circle, retreat and telegraph counter-punches; football bots support, defend, pass, shoot and keep goal; three bot racers per race.',
        'NPC bị khiêu khích sẽ đuổi, vòng quanh, lùi lại và báo trước cú phản đòn; bot bóng đá hỗ trợ, phòng ngự, chuyền, sút và bắt gôn; ba bot đua mỗi chặng.'),
      m('Grid pathfinding', 'algorithm',
        'Shortest paths on a static navigation grid using a binary heap, for maze bots and ambient chase or flee.',
        'Đường ngắn nhất trên lưới điều hướng tĩnh dùng binary heap, cho bot mê cung và rượt đuổi, bỏ chạy.'),
      m('Adaptive graphics controller', 'algorithm',
        'Reads the real WebGL renderer and CPU/RAM hints, drops quality after sustained slow frames (two steps below 12 FPS) and raises it after sustained smooth ones, with cooldowns.',
        'Đọc renderer WebGL thật và gợi ý CPU/RAM, hạ chất lượng khi khung hình chậm kéo dài (hạ hai bậc dưới 12 FPS) và nâng khi mượt ổn định, có thời gian chờ chống dao động.'),
    ],
    groups: [
      g('Game AI', 'Game AI', [
        s({ en: 'Finite-state machines', vi: 'State machine' }, 'NPC pursue, circle, retreat and counter-punch states with 0.55 s telegraphs.', 'Trạng thái NPC đuổi, vòng, lùi và phản đòn, báo trước 0,55 giây.'),
        s({ en: 'Grid pathfinding', vi: 'Tìm đường trên lưới' }, 'Shortest paths with a binary heap for maze racers and ambient chase.', 'Đường ngắn nhất bằng binary heap cho bot đua mê cung và rượt đuổi.'),
        s({ en: 'Team bots', vi: 'Bot đồng đội' }, '3v3 football bots that support, defend, pass, shoot and keep goal.', 'Bot bóng đá 3v3 biết hỗ trợ, phòng ngự, chuyền, sút và bắt gôn.'),
        s({ en: 'Adaptive difficulty', vi: 'Độ khó thích ứng' }, 'The pickleball opponent adapts to your saved wins.', 'Đối thủ pickleball thích ứng theo số trận thắng đã lưu.'),
      ], true),
      g('3D & rendering', '3D & kết xuất', [
        s('WebGL 2', 'Browser graphics context for the city and activity scenes.', 'Ngữ cảnh đồ họa trình duyệt cho thành phố và các cảnh hoạt động.'),
        s('React Three Fiber', 'Declarative scene graph for the city, vehicles, NPCs and activity arenas.', 'Scene graph khai báo cho thành phố, xe, NPC và các đấu trường.'),
        s('Three.js', 'WebGL 2 rendering, raycast collision and skinned characters.', 'Kết xuất WebGL 2, va chạm raycast và nhân vật có skin.'),
        s('drei', 'Sky, environment lighting and GLTF loading helpers.', 'Bầu trời, ánh sáng môi trường và tiện ích nạp GLTF.'),
        s('Postprocessing', 'Bloom and effects that switch off on low presets.', 'Bloom và hiệu ứng tự tắt ở mức cấu hình thấp.'),
        s('InstancedMesh', 'Draws repeated props and crowds in few draw calls.', 'Vẽ đạo cụ và đám đông lặp lại với ít draw call.'),
        s('SkeletonUtils', 'Clones rigged character models safely for many NPCs.', 'Nhân bản model nhân vật có rig an toàn cho nhiều NPC.'),
        s({ en: 'Procedural geometry', vi: 'Hình học procedural' }, 'Original city blocks and interiors — nothing extracted from commercial games.', 'Khối phố và nội thất nguyên bản — không trích xuất từ game thương mại.'),
        s({ en: 'Adaptive graphics', vi: 'Đồ họa thích ứng' }, 'Detects SwiftShader/llvmpipe, scales resolution, population and effects from sustained FPS.', 'Nhận ra SwiftShader/llvmpipe, co giãn độ phân giải, mật độ và hiệu ứng theo FPS duy trì.'),
      ]),
      g('Gameplay systems', 'Hệ thống gameplay', [
        s({ en: 'Vehicle controllers', vi: 'Điều khiển xe' }, 'Sedan with a first-person cabin and linked steering wheel; motorbike with an assisted single-track controller and lean.', 'Ô tô có khoang lái góc nhìn thứ nhất và vô lăng liên kết; xe máy một vệt bánh có hỗ trợ và nghiêng xe.'),
        s({ en: 'Procedural mazes', vi: 'Mê cung procedural' }, 'Seeded DFS builds a connected 13×13 maze each run; BFS picks a distant exit.', 'DFS có seed dựng mê cung 13×13 liên thông mỗi lượt; BFS chọn lối ra xa.'),
        s({ en: 'Seeded PRNG', vi: 'PRNG có seed' }, 'mulberry32 makes layouts reproducible from a seed.', 'mulberry32 giúp tái tạo bố cục từ seed.'),
        s({ en: 'Fixed-step simulation', vi: 'Mô phỏng bước cố định' }, 'Activities simulate at a fixed rate while the HUD publishes at 10 Hz.', 'Hoạt động mô phỏng theo nhịp cố định, HUD cập nhật 10 Hz.'),
        s({ en: 'Route navigation', vi: 'Dẫn đường' }, 'Routes along the 54 m street grid to a venue’s entrance, shown on the minimap with a turn arrow.', 'Tìm đường theo lưới phố 54 m tới cửa địa điểm, hiện trên minimap kèm mũi tên rẽ.'),
        s({ en: 'Mission design', vi: 'Thiết kế nhiệm vụ' }, 'Night race, construction escape, glass bridge, street football, prop hunt, bomb maze, delivery and patrol chase.', 'Đua đêm, vượt công trường, cầu kính, bóng đá đường phố, núp lốt, đấu bom, giao hàng và cắt đuôi tuần tra.'),
        s({ en: 'Combat system', vi: 'Hệ cận chiến' }, 'Timed unarmed combat with range and wall checks and a shared damage cooldown.', 'Cận chiến tay không có canh thời gian, kiểm tra tầm và tường, hồi sát thương chung.'),
        s({ en: 'Game economy', vi: 'Kinh tế game' }, 'Survival permit, rewards, collectible cards, shops and supplies.', 'Giấy phép sinh tồn, phần thưởng, thẻ sưu tầm, cửa hàng và vật phẩm.'),
      ]),
      g('State, input & audio', 'Trạng thái, điều khiển & âm thanh', [
        s('React 19 · TypeScript', 'UI, HUD and menus around the 3D canvas.', 'Giao diện, HUD và menu quanh canvas 3D.'),
        s('Zustand', 'Game, navigation and career stores with mutable per-frame state kept out of React renders.', 'Store game, dẫn đường và tiến trình; state theo khung hình nằm ngoài vòng render React.'),
        s('IndexedDB', 'Local career saves and a single-writer tab lease so only one tab plays.', 'Lưu tiến trình local và khóa một tab ghi để chỉ một tab được chơi.'),
        s({ en: 'Retry-safe settlement', vi: 'Quyết toán an toàn' }, 'Rewards are settled once and retried without duplicates.', 'Phần thưởng được quyết toán một lần, thử lại không bị nhân đôi.'),
        s('Pointer Lock API', 'Mouse-look with keyboard-first controls and handled request rejection.', 'Nhìn bằng chuột, điều khiển ưu tiên bàn phím, xử lý khi trình duyệt từ chối.'),
        s('Web Audio', 'Procedural city ambience, horns and effects that start only after the player presses start.', 'Âm thanh thành phố, còi xe và hiệu ứng tổng hợp bằng code, chỉ phát sau khi bấm bắt đầu.'),
      ]),
      g('Quality & delivery', 'Chất lượng & triển khai', [
        s('Vitest', 'Unit tests for activities, persistence, controls and coordinates.', 'Unit test cho hoạt động, lưu trữ, điều khiển và tọa độ.'),
        s('Playwright', 'End-to-end runs, including a recorded maze-race victory.', 'Test end-to-end, gồm một lượt thắng đua mê cung được ghi lại.'),
        s('ESLint', 'Lint and type-check gates before build.', 'Lint và type-check trước khi build.'),
        s({ en: 'Rendering reports', vi: 'Báo cáo kết xuất' }, 'Separate software and hardware Chrome benchmarks with inspected screenshots.', 'Benchmark Chrome riêng cho renderer phần mềm và phần cứng, kèm ảnh chụp kiểm tra.'),
        s('Vite · Cloudflare Workers', 'Static-asset deployment with SPA routing.', 'Triển khai static assets với định tuyến SPA.'),
      ]),
    ],
  },
  'math-lab': {
    depth: 'pretrained',
    verdict: {
      en: 'A hybrid. Qwen3-VL 8B (via Ollama) reads photos and fills a strict semantic JSON only when the deterministic grammar cannot parse a problem; solving, choosing the visual and drawing stay in verified code, so the AI never draws freely. A QLoRA pipeline is built and a one-step 4B smoke run passed, but no adapter is in production — the 8B run stopped at the VRAM gate.',
      vi: 'Hệ lai. Qwen3-VL 8B (qua Ollama) đọc ảnh và điền JSON ngữ nghĩa chặt chẽ chỉ khi grammar xác định không đọc được đề; phần giải, chọn hình và dựng hình nằm trong code đã kiểm chứng, nên AI không bao giờ tự vẽ. Pipeline QLoRA đã dựng xong và bản chạy thử 4B một bước đã qua, nhưng chưa adapter nào vào production — lượt 8B dừng ở cổng VRAM.',
    },
    models: [
      m('Qwen3-VL 8B Instruct (Ollama)', 'pretrained',
        'Production vision-language model: OCR, splitting questions and choices, and a ProviderDocument JSON when the grammar is not enough. 12,288-token context, full GPU offload.',
        'Model thị giác-ngôn ngữ production: OCR, tách câu hỏi và lựa chọn, sinh JSON ProviderDocument khi grammar chưa đủ. Context 12.288 token, nạp toàn bộ lên GPU.'),
      m('Qwen3-VL 4B + QLoRA smoke', 'pilot',
        'One-step pipeline check (r8 / α16 on q, k, v, o): eval loss 0.242, token accuracy 0.959. Marked not eligible and never loaded in production.',
        'Chạy thử pipeline một bước (r8 / α16 trên q, k, v, o): eval loss 0,242, token accuracy 0,959. Đánh dấu không đủ điều kiện, không nạp vào production.'),
      m('Qwen3-VL 8B Thinking', 'pretrained',
        'Benchmarked and rejected: it did not finish the full schema within the 180-second window.',
        'Đã benchmark và loại: không hoàn thành schema trong cửa sổ 180 giây.'),
      m('Deterministic solvers', 'algorithm',
        'Exact rational arithmetic, Gauss-Jordan elimination and closed-form solvers for quadratic, biquadratic, radical, rational and absolute-value equations.',
        'Số hữu tỉ chính xác, khử Gauss-Jordan và bộ giải dạng đóng cho phương trình bậc hai, trùng phương, chứa căn, hữu tỉ và trị tuyệt đối.'),
      m('Decision engine', 'algorithm',
        'Maps family, domain and grade to one of 29 visual types and fails closed when a binding is missing.',
        'Ánh xạ họ bài, miền và lớp sang một trong 29 kiểu trực quan, dừng an toàn khi thiếu binding.'),
    ],
    groups: [
      g('Vision-language AI', 'AI thị giác-ngôn ngữ', [
        s('Qwen3-VL 8B', 'Reads photographed problems and extracts questions and choices.', 'Đọc đề chụp ảnh, tách câu hỏi và các lựa chọn.'),
        s('Ollama', 'Local VLM runtime with full GPU offload and bounded output.', 'Runtime VLM local, nạp toàn bộ lên GPU, giới hạn đầu ra.'),
        s({ en: 'Structured output', vi: 'Đầu ra có cấu trúc' }, 'The model must return a ProviderDocument JSON validated by Pydantic with extra fields forbidden.', 'Model phải trả JSON ProviderDocument được Pydantic kiểm tra, cấm trường thừa.'),
        s({ en: 'Hybrid AI design', vi: 'Thiết kế AI lai' }, 'Grammar first, VLM only as fallback; the model may not add answers, HTML or code.', 'Grammar trước, VLM chỉ là dự phòng; model không được thêm đáp án, HTML hay code.'),
        s({ en: 'Model benchmarking', vi: 'Benchmark model' }, 'Instruct kept for 7–10 s responses; the thinking variant rejected for latency.', 'Giữ bản Instruct vì phản hồi 7–10 s; bản thinking bị loại vì quá chậm.'),
      ], true),
      g('Fine-tuning pipeline', 'Pipeline fine-tune', [
        s('QLoRA (NF4)', 'Target config for Qwen3-VL 8B: 4-bit NF4, double quant, bf16 compute, r8 / α16, frozen vision tower.', 'Cấu hình cho Qwen3-VL 8B: 4-bit NF4, double quant, tính bf16, r8 / α16, đóng băng vision tower.'),
        s('TRL · PEFT', 'Pinned revisions; prompt-completion records with completion-only loss.', 'Khóa phiên bản; dữ liệu prompt-completion với loss chỉ trên phần completion.'),
        s('bitsandbytes', '4-bit quantisation for memory-efficient training.', 'Lượng tử hóa 4-bit để huấn luyện tiết kiệm bộ nhớ.'),
        s({ en: 'Smoke run', vi: 'Chạy thử pipeline' }, 'One-step 4B run proved the pipeline end to end; recorded as not eligible.', 'Chạy 4B một bước chứng minh pipeline thông suốt; ghi nhận là chưa đủ điều kiện.'),
        s({ en: 'VRAM gate', vi: 'Cổng VRAM' }, 'The 8B run waits for 12 GB of free VRAM instead of killing other processes.', 'Lượt 8B chờ đủ 12 GB VRAM trống thay vì dừng tiến trình khác.'),
        s({ en: 'Acceptance thresholds', vi: 'Ngưỡng chấp nhận' }, 'An adapter ships only with 100% schema validity, 0% answer leakage, ≥ 99% role and ≥ 98% renderer accuracy.', 'Adapter chỉ được dùng khi schema hợp lệ 100%, rò đáp án 0%, vai trò ≥ 99% và chọn renderer ≥ 98%.'),
      ], true),
      g('Data engineering', 'Kỹ thuật dữ liệu', [
        s({ en: 'Synthetic data generation', vi: 'Sinh dữ liệu tổng hợp' }, 'Deterministic generator (seed 260826): 11,360 / 1,704 / 1,704 text-plus-image records across 71 families.', 'Generator xác định (seed 260826): 11.360 / 1.704 / 1.704 bản ghi chữ + ảnh cho 71 họ bài.'),
        s({ en: 'Split-leakage audit', vi: 'Kiểm tra rò rỉ tập' }, '100% schema validity, zero unknown leakage and no shared stems between splits.', 'Schema hợp lệ 100%, không rò ẩn số và không trùng đề giữa các tập.'),
        s({ en: 'Data governance', vi: 'Quản trị dữ liệu' }, 'sources.lock with revisions, checksums and licences; no web source is allowed into training.', 'sources.lock ghi phiên bản, checksum và giấy phép; không nguồn web nào được đưa vào train.'),
        s({ en: 'Holdout benchmarks', vi: 'Tập holdout' }, 'We-Math, MathVista and MathNet kept out of training for evaluation.', 'We-Math, MathVista và MathNet giữ ngoài dữ liệu train để đánh giá.'),
        s({ en: 'Semantic clustering', vi: 'Gom cụm ngữ nghĩa' }, 'Fingerprints ignore names and numbers so new problem families are discovered by structure.', 'Dấu vân tay bỏ qua tên và số để phát hiện họ bài mới theo cấu trúc.'),
        s({ en: 'Human-in-the-loop', vi: 'Có người duyệt' }, 'Feedback is stored as pending review and never becomes training data automatically.', 'Phản hồi lưu ở trạng thái chờ duyệt, không tự động thành dữ liệu train.'),
      ], true),
      g('Math engine', 'Engine toán', [
        s({ en: 'Vietnamese math parsing', vi: 'Phân tích toán tiếng Việt' }, 'Understands “x mũ 2”, “3 phần 5”, “căn bậc hai của” and Unicode symbols while keeping the original text.', 'Hiểu “x mũ 2”, “3 phần 5”, “căn bậc hai của” và ký hiệu Unicode mà vẫn giữ nguyên đề gốc.'),
        s('Gauss-Jordan', 'Exact elimination with rank checks to classify unique, infinite or no solutions for 2- and 3-variable systems.', 'Khử chính xác có kiểm tra hạng để phân loại nghiệm duy nhất, vô số hoặc vô nghiệm cho hệ 2 và 3 ẩn.'),
        s({ en: 'Exact arithmetic', vi: 'Số học chính xác' }, 'Python Fraction for rationals and BigInt factorials up to 500!.', 'Fraction của Python cho số hữu tỉ và BigInt cho giai thừa tới 500!.'),
        s({ en: 'Equation solvers', vi: 'Bộ giải phương trình' }, 'Quadratic, cubic, biquadratic, radical and rational equations, with extraneous roots removed.', 'Phương trình bậc hai, bậc ba, trùng phương, chứa căn và hữu tỉ, loại nghiệm ngoại lai.'),
        s({ en: 'Word-problem grammars', vi: 'Grammar toán lời văn' }, 'Ratio, work-days, motion, remaining fractions and two-item discount systems.', 'Tỉ số, công-ngày, chuyển động, phần còn lại và hệ giảm giá hai mặt hàng.'),
        s({ en: 'Unit normalisation', vi: 'Chuẩn hóa đơn vị' }, 'Compatible units converted before any calculation.', 'Đơn vị tương thích được quy đổi trước khi tính.'),
        s({ en: 'Verification oracle', vi: 'Kiểm chứng kết quả' }, 'Answers substituted back, source text preserved and scene invariants checked.', 'Thay nghiệm lại vào đề, giữ nguyên đề gốc và kiểm tra bất biến của scene.'),
      ]),
      g('Pedagogy & visualisation', 'Sư phạm & trực quan', [
        s({ en: 'Pedagogy planning', vi: 'Kế hoạch sư phạm' }, 'Observe → transform → conclude → check, step by step.', 'Quan sát → biến đổi → kết luận → kiểm tra, từng bước.'),
        s({ en: 'Visual decision engine', vi: 'Decision engine' }, 'Registry of renderers, domains and allowed grades; fails closed.', 'Registry renderer, miền và lớp được phép; dừng an toàn khi thiếu.'),
        s({ en: '29 visual types', vi: '29 kiểu trực quan' }, 'Bar models, algebra tiles, balance, number line, place value, column algorithms, probability simulator, charts, clocks and more.', 'Bar model, algebra tiles, cân bằng, trục số, giá trị hàng, tính cột dọc, mô phỏng xác suất, biểu đồ, đồng hồ và nhiều hơn.'),
        s('React 19', '30 deterministic renderer components driven by one world state.', '30 component renderer xác định chạy từ một world state chung.'),
        s('Three.js', '3D geometry, solids and Oxyz planes and surfaces.', 'Hình học 3D, hình khối, mặt phẳng và mặt cong Oxyz.'),
        s('SVG', '2D diagrams with key conclusions also in DOM text for accessibility.', 'Sơ đồ 2D, kết luận quan trọng có cả dạng text DOM để dễ tiếp cận.'),
        s({ en: 'Shared playback state', vi: 'Playback dùng chung' }, 'One progress value keeps every representation on the same teaching step.', 'Một giá trị tiến trình giữ mọi biểu diễn ở cùng bước giảng.'),
      ]),
      g('Backend & quality', 'Backend & chất lượng', [
        s('Python', 'Parsing, exact solvers, semantic validation and dataset tooling.', 'Phân tích đề, bộ giải chính xác, kiểm tra ngữ nghĩa và công cụ dữ liệu.'),
        s('JavaScript · Vite', 'React renderer modules and the frontend development and build pipeline.', 'Module renderer React cùng quy trình phát triển và build frontend.'),
        s('FastAPI · Pydantic', 'Math Lab API and strict schemas between analysis, planning and rendering.', 'API Math Lab và schema chặt giữa phân tích, lập kế hoạch và hiển thị.'),
        s('PostgreSQL · SQLAlchemy', 'Feedback, semantic models and scenes stored for review.', 'Lưu phản hồi, semantic model và scene để duyệt.'),
        s('Redis', 'Last five turns per user with an atomic LPUSH + LTRIM + EXPIRE transaction.', 'Năm lượt gần nhất mỗi người dùng bằng transaction LPUSH + LTRIM + EXPIRE.'),
        s('Docker Compose', 'Demo stack integrated into the EduVisionAI platform.', 'Stack demo tích hợp vào nền tảng EduVisionAI.'),
        s('pytest · Vitest', '253 backend and 542 frontend tests passing.', '253 test backend và 542 test frontend đều đạt.'),
        s({ en: 'Acceptance matrix', vi: 'Ma trận chấp nhận' }, '270 / 270 cases across 71 problem families, with regression gates per visual family.', '270 / 270 ca trên 71 họ bài, có regression gate cho từng họ trực quan.'),
      ]),
    ],
  },
  'smart-classroom': {
    depth: 'none',
    verdict: {
      en: 'No AI model runs in this build. It is the product-storytelling front end for an AI classroom: AI vision, the agent and the digital twin appear as 3D scenes, and the classroom and students are sculpted in code.',
      vi: 'Bản này không chạy model AI nào. Đây là front-end kể chuyện sản phẩm cho lớp học AI: AI Vision, AI agent và digital twin được thể hiện thành cảnh 3D, còn lớp học và học sinh được tạc bằng code.',
    },
    models: [],
    groups: [
      g('3D graphics', 'Đồ họa 3D', [
        s('WebGL', 'GPU rendering for the interactive classroom presentation.', 'Kết xuất trên GPU cho bài trình bày lớp học tương tác.'),
        s('Three.js', 'The whole classroom, characters, camera and effects, loaded as ES modules without a bundler.', 'Toàn bộ lớp học, nhân vật, camera và hiệu ứng, nạp dạng ES module không cần bundler.'),
        s({ en: 'Procedural modelling', vi: 'Dựng hình procedural' }, 'Loft, tube, sculpt and curved-panel geometry functions build every body and garment.', 'Các hàm hình học loft, tube, sculpt và tấm cong dựng mọi cơ thể và trang phục.'),
        s({ en: 'Character anatomy', vi: 'Giải phẫu nhân vật' }, 'Proportions from head-height units — 4.4 seated students, a 7.4 standing teacher.', 'Tỉ lệ theo đơn vị chiều cao đầu — học sinh ngồi 4,4, cô giáo đứng 7,4.'),
        s('MeshPhysicalMaterial', 'Fabric with sheen so the white shirts read as cloth, not porcelain.', 'Vải có sheen để áo trắng trông như vải chứ không như sứ.'),
        s('CanvasTexture', 'Procedural fabric normal maps and textures drawn in code.', 'Normal map sợi vải và texture vẽ bằng code.'),
        s('ShaderMaterial', 'Custom GLSL atmosphere glow for the Earth in the solar-system scene.', 'Shader GLSL tự viết cho quầng khí quyển Trái Đất trong cảnh Hệ Mặt Trời.'),
        s('EffectComposer · Bloom', 'Unreal bloom whose strength changes per camera keyframe.', 'Unreal bloom đổi cường độ theo từng keyframe camera.'),
      ]),
      g('Animation', 'Hoạt ảnh', [
        s('GLTFLoader · SkinnedMesh', 'Rigged teacher model, with a procedural teacher as fallback if loading fails.', 'Model giáo viên có rig, fallback sang giáo viên procedural nếu nạp lỗi.'),
        s({ en: 'Mixamo bone animation', vi: 'Hoạt ảnh xương Mixamo' }, 'Idle, looking at the class, weight shifts and presenting gestures driven directly on bones.', 'Đứng, nhìn lớp, chuyển trọng tâm và cử chỉ giảng điều khiển trực tiếp trên xương.'),
        s({ en: 'Scroll-driven animation', vi: 'Hoạt ảnh theo cuộn' }, 'Scroll is the playhead across eleven chapters.', 'Cuộn trang là playhead xuyên suốt mười một chương.'),
        s({ en: 'Camera choreography', vi: 'Biên đạo camera' }, 'Keyframes interpolate position, target, effect weights and bloom so sections never jump.', 'Keyframe nội suy vị trí, điểm nhìn, trọng số hiệu ứng và bloom để không bị giật.'),
        s({ en: 'Motion design', vi: 'Motion design' }, 'Logo copies orbit, converge, spin 720° and open as a portal into the classroom.', 'Bản sao logo bay quỹ đạo, hội tụ, xoay 720° rồi mở thành cổng vào lớp học.'),
      ]),
      g('Performance & delivery', 'Hiệu năng & triển khai', [
        s({ en: 'Hardware-aware quality', vi: 'Chất lượng theo phần cứng' }, 'GPU, memory, cores and texture limits pick a low / medium / high tier before geometry is built — about 9,000 triangles per student.', 'GPU, bộ nhớ, số nhân và giới hạn texture chọn mức thấp / vừa / cao trước khi dựng hình — khoảng 9.000 tam giác mỗi học sinh.'),
        s('IntersectionObserver', 'Text reveals only when sections enter the viewport.', 'Chữ chỉ hiện khi phần nội dung vào khung nhìn.'),
        s({ en: 'Reduced motion', vi: 'Giảm chuyển động' }, 'Respects prefers-reduced-motion.', 'Tôn trọng thiết lập prefers-reduced-motion.'),
        s('JavaScript', 'Vanilla JS with no framework or build step required to run.', 'JavaScript thuần, không framework, chạy không cần build.'),
        s('Cloudflare Workers', 'Static-asset deployment with SPA fallback via Wrangler.', 'Triển khai static assets có fallback SPA qua Wrangler.'),
      ]),
    ],
  },
  kho: {
    depth: 'none',
    verdict: {
      en: 'No AI model. Everything that feels generated is procedural or synthesised in code — terrain from a height function, gongs from Web Audio, craft objects from lathe geometry. The word reader uses the browser’s built-in voice and says plainly that it is not a native speaker.',
      vi: 'Không dùng model AI. Mọi thứ có vẻ "được sinh ra" đều là procedural hoặc tổng hợp bằng code — địa hình từ hàm độ cao, tiếng chiêng từ Web Audio, đồ vật từ hình học tiện. Nút đọc từ dùng giọng có sẵn của trình duyệt và nói rõ đó không phải giọng người bản ngữ.',
    },
    models: [],
    groups: [
      g('3D & graphics', '3D & đồ họa', [
        s('React Three Fiber', 'Langbiang scenes and the 3D brocade product stage.', 'Cảnh Langbiang và sân khấu 3D cho sản phẩm thổ cẩm.'),
        s('Three.js', 'Rendering for the scenes and the embedded first-person game.', 'Kết xuất cho các cảnh và game góc nhìn thứ nhất được nhúng.'),
        s('drei · postprocessing', 'Scene helpers and bloom.', 'Tiện ích scene và bloom.'),
        s({ en: 'Procedural terrain', vi: 'Địa hình procedural' }, 'Two Gaussian peaks for K’Lang and Hơ Biang plus fBm-noise slopes, depth fog and drifting clouds.', 'Hai chóp Gauss cho K’Lang và Hơ Biang cộng sườn nhiễu fBm, sương theo chiều sâu và mây trôi.'),
        s('LatheGeometry', 'Seven craft objects — brocade, bronze ring, basket, jar, loom, gongs, horn — with no model files.', 'Bảy đồ vật — thổ cẩm, vòng đồng, gùi, ché, khung dệt, chiêng, tù và — không cần file model.'),
        s({ en: 'Canvas textures', vi: 'Texture canvas' }, 'Dawn sky and material textures painted with the 2D canvas.', 'Bầu trời rạng đông và texture vật liệu vẽ bằng canvas 2D.'),
        s({ en: 'First-person game', vi: 'Game góc nhìn thứ nhất' }, 'Langbiang Chronicles: eight knowledge gates and 20 Flagcards, same-origin with pointer lock.', 'Langbiang Chronicles: tám cổng tri thức và 20 Flagcard, cùng origin, có khóa chuột.'),
      ]),
      g('Audio & motion', 'Âm thanh & chuyển động', [
        s('Web Audio', 'A playable six-gong set synthesised with oscillators — no audio files, works offline.', 'Bộ sáu chiêng chơi được, tổng hợp bằng oscillator — không file âm thanh, chạy offline.'),
        s('Speech Synthesis', '38 K’ho words read by the browser voice, clearly labelled as machine reading.', '38 từ K’ho đọc bằng giọng trình duyệt, ghi rõ là máy đọc.'),
        s('GSAP', 'Entrance and presentation animations.', 'Hoạt ảnh xuất hiện và trình chiếu.'),
        s('Lenis', 'Smooth scrolling for the long-form document mode.', 'Cuộn mượt cho chế độ tư liệu dài.'),
        s({ en: 'Step-based deck engine', vi: 'Engine trình chiếu theo nhịp' }, '20 slides and 46 steps driven by scroll, keys, swipe or click, with five replaying entrance motions.', '20 trang, 46 nhịp điều khiển bằng cuộn, phím, vuốt hoặc bấm, năm kiểu xuất hiện chạy lại.'),
      ]),
      g('Front end & data', 'Front-end & dữ liệu', [
        s('React 19 · TypeScript', 'Four modes: presentation deck, long-form document, brocade market and K’ho language.', 'Bốn chế độ: trình chiếu, tư liệu dài, chợ thổ cẩm và tiếng K’ho.'),
        s({ en: 'Cartography', vi: 'Bản đồ' }, 'Natural Earth 10m boundaries as generated paths, zooming province by province with a counter-scaled pin.', 'Ranh giới Natural Earth 10m thành path tự sinh, phóng từng tỉnh với ghim co ngược tỉ lệ.'),
        s('SVG', 'Hand-built costume diagrams and six brocade patterns with natural dyes.', 'Sơ đồ trang phục và sáu hoa văn thổ cẩm với màu nhuộm tự nhiên vẽ tay.'),
        s({ en: 'Source-aware content', vi: 'Nội dung có nguồn' }, 'Nhân Dân, VNA, VOV, Lâm Đồng press and UNESCO records; videos verified via oEmbed before embedding.', 'Nhân Dân, TTXVN, VOV, báo Lâm Đồng và hồ sơ UNESCO; video đối chiếu bằng oEmbed trước khi nhúng.'),
        s({ en: 'Marketplace UX', vi: 'UX thương mại' }, 'Search, filters, rent-or-buy and a live 50% contribution to a K’ho education fund.', 'Tìm kiếm, lọc, thuê hoặc mua và 50% trích quỹ giáo dục K’ho tính trực tiếp.'),
      ]),
      g('Quality & delivery', 'Chất lượng & triển khai', [
        s('Vite · ESLint', 'Build and lint with typed React rules.', 'Build và lint với luật React có kiểu.'),
        s('Cloudflare Workers', 'Worker with an assets binding and SPA fallback, deployed with Wrangler.', 'Worker có assets binding và fallback SPA, triển khai bằng Wrangler.'),
        s({ en: 'Offline-first', vi: 'Chạy offline' }, 'No model, audio or video files required for the core deck, so it runs in an exam room without internet.', 'Deck chính không cần file model, âm thanh hay video nên chạy được trong phòng thi mất mạng.'),
      ]),
    ],
  },
  picko247: {
    depth: 'rules',
    verdict: {
      en: 'No machine learning. The Rally 247 opponent is hand-written game AI: it chases the predicted landing point and aims for the open corner, growing faster and more accurate as the rally lengthens.',
      vi: 'Không dùng học máy. Đối thủ trong Rally 247 là game AI viết tay: đuổi theo điểm rơi dự đoán và đánh vào góc trống, càng rally lâu càng nhanh và chính xác hơn.',
    },
    models: [
      m('Rally 247 opponent', 'algorithm',
        'Predicts where the ball will land, moves there and returns into the open corner; speed and accuracy scale with rally length.',
        'Dự đoán điểm rơi, di chuyển tới đó và đánh trả vào góc trống; tốc độ và độ chính xác tăng theo độ dài rally.'),
      m('Ballistic solver', 'algorithm',
        'Each hit solves the trajectory to land exactly on the aim point, lifting the arc to clear the net.',
        'Mỗi cú đánh giải phương trình quỹ đạo để bóng rơi đúng điểm ngắm, tự nâng vòng cung để qua lưới.'),
    ],
    groups: [
      g('Game AI & physics', 'Game AI & vật lý', [
        s({ en: 'AI opponent', vi: 'Đối thủ AI' }, 'Predicts the landing point and targets the open corner, scaling with rally length.', 'Dự đoán điểm rơi và đánh vào góc trống, mạnh dần theo độ dài rally.'),
        s({ en: 'Ballistic physics', vi: 'Vật lý đạn đạo' }, 'Trajectory solved per hit so the ball lands on the aim point and clears the net.', 'Giải quỹ đạo mỗi cú đánh để bóng rơi đúng điểm ngắm và qua lưới.'),
      ], true),
      g('3D game', 'Game 3D', [
        s('Three.js', 'First-person rally engine separated from React and lazy-loaded as its own chunk.', 'Engine rally góc nhìn thứ nhất tách khỏi React, lazy-load thành chunk riêng.'),
        s({ en: 'Game feel', vi: 'Cảm giác chơi' }, 'Landing marker, ball trail, particles, screen shake, FOV kick, perfect hits and ×5 combos.', 'Vòng điểm rơi, vệt bóng, particle, rung màn hình, FOV kick, perfect hit và combo ×5.'),
        s('Pointer Lock API', 'Mouse aiming, with a drag-to-aim fallback when the browser refuses.', 'Ngắm bằng chuột, fallback kéo để ngắm khi trình duyệt từ chối.'),
        s({ en: 'Touch controls', vi: 'Điều khiển cảm ứng' }, 'Virtual joystick, right-half aiming and SWING / DASH buttons on phones.', 'Joystick ảo, ngắm bằng nửa phải màn hình và nút SWING / DASH trên điện thoại.'),
        s('Web Audio', 'All sound synthesised in code — no audio files.', 'Mọi âm thanh tổng hợp bằng code — không file âm thanh.'),
        s({ en: 'WebGL fallback', vi: 'Fallback WebGL' }, 'A clear error screen when the device cannot run WebGL.', 'Màn hình báo lỗi rõ ràng khi máy không chạy được WebGL.'),
      ]),
      g('Tournament logic', 'Logic giải đấu', [
        s({ en: 'Computed standings', vi: 'Bảng xếp hạng tính toán' }, 'Group tables recomputed from results; editing a score reorders them immediately.', 'Bảng đấu tính lại từ kết quả; sửa tỉ số là thứ hạng đổi ngay.'),
        s({ en: 'Bracket advancement', vi: 'Nhánh đấu tự đi tiếp' }, 'Winners move through next-match links; reopening a match withdraws them.', 'Đội thắng đi tiếp qua liên kết next-match; mở lại trận sẽ rút đội thắng.'),
        s({ en: 'Seeded PRNG', vi: 'PRNG có seed' }, 'Identical demo results every run, with dates relative to today.', 'Kết quả demo giống nhau mỗi lần chạy, ngày tháng tính theo hôm nay.'),
        s({ en: 'Rating history', vi: 'Lịch sử rating' }, 'Rating updates write history records shown on athlete profiles.', 'Cập nhật rating ghi lịch sử hiển thị trên hồ sơ vận động viên.'),
        s({ en: 'Gamification', vi: 'Gamification' }, 'Badges, play points, fan leaderboard and match predictions with no real money.', 'Huy hiệu, điểm chơi, bảng xếp hạng fan và dự đoán trận không dùng tiền thật.'),
        s({ en: 'ERD design', vi: 'Thiết kế ERD' }, 'Documented data model keeping athlete ratings separate from game scores.', 'Mô hình dữ liệu có tài liệu, tách rating vận động viên khỏi điểm game.'),
      ]),
      g('Front end', 'Front-end', [
        s('React 18', 'Match center, tour, rankings, athlete profiles, play and admin pages.', 'Các trang match center, giải đấu, xếp hạng, hồ sơ, chơi game và quản trị.'),
        s('TypeScript', 'Strict mode with a full domain model.', 'Chế độ strict với mô hình domain đầy đủ.'),
        s('React Router', 'Routes for every page including a deep-linkable fan tab.', 'Định tuyến cho mọi trang, kể cả tab fan có thể deep-link.'),
        s('Tailwind CSS', 'Styling with design tokens.', 'Styling với design token.'),
        s({ en: 'Overlay architecture', vi: 'Kiến trúc overlay' }, 'The game opens from anywhere without a reload while the match countdown stays visible.', 'Game mở từ bất cứ đâu không tải lại trang, đồng hồ trận vẫn hiển thị.'),
        s({ en: 'SVG charts', vi: 'Biểu đồ SVG' }, 'Hand-written rating charts and generated avatars with no chart library.', 'Biểu đồ rating và avatar tự sinh bằng SVG, không cần thư viện.'),
        s('localStorage', 'Self-healing persistence and admin CRUD for tournaments, athletes and matches.', 'Lưu trữ tự phục hồi và CRUD quản trị cho giải, vận động viên và trận.'),
        s('Vite · Cloudflare Workers', 'Static build and live deployment.', 'Build tĩnh và triển khai live.'),
      ]),
    ],
  },
  happytoplay: {
    depth: 'pretrained',
    verdict: {
      en: 'Yes, pretrained models — none fine-tuned. MediaPipe’s hand-landmark model drives gesture games and sign phrases, the Web Speech API handles speech in the browser, and a VoiceBridge prototype in the same repository runs Vietnamese speech recognition and synthesis on-device with ONNX models.',
      vi: 'Có, dùng model pretrained — không fine-tune. Model hand landmark của MediaPipe điều khiển game cử chỉ và cụm từ ký hiệu, Web Speech API xử lý giọng nói trên trình duyệt, còn prototype VoiceBridge trong cùng repository chạy nhận dạng và tổng hợp tiếng Việt ngay trên máy bằng model ONNX.',
    },
    models: [
      m('MediaPipe Hand Landmarker', 'pretrained',
        '21 hand landmarks per frame in the browser via WebAssembly; gestures are then classified by hand-written geometric rules.',
        '21 điểm mốc bàn tay mỗi khung hình ngay trên trình duyệt qua WebAssembly; cử chỉ được phân loại bằng luật hình học tự viết.'),
      m('Web Speech API', 'pretrained',
        'Browser speech-to-text in Chrome and Edge for captions and voice features, plus speech synthesis.',
        'Chuyển giọng nói thành chữ trên Chrome và Edge cho phụ đề và tính năng giọng nói, cùng đọc thành tiếng.'),
      m('sherpa-onnx Zipformer vi (INT8)', 'pretrained',
        '30M-parameter Vietnamese speech recognition in the VoiceBridge FastAPI prototype.',
        'Nhận dạng tiếng Việt 30 triệu tham số trong prototype FastAPI VoiceBridge.'),
      m('Piper TTS vi_VN-vivos', 'pretrained',
        'Local Vietnamese text-to-speech for spoken replies.',
        'Chuyển văn bản thành giọng nói tiếng Việt ngay trên máy.'),
      m('Ollama LLM (optional)', 'pretrained',
        'Short context suggestions for real-time conversation, replaced by deterministic suggestions whenever Ollama is offline.',
        'Gợi ý ngữ cảnh ngắn cho hội thoại thời gian thực, thay bằng gợi ý cố định khi Ollama không chạy.'),
    ],
    groups: [
      g('Accessibility AI', 'AI hỗ trợ tiếp cận', [
        s('MediaPipe Hands', '21-landmark hand tracking in the browser for sign phrases and gesture games.', 'Theo dõi 21 điểm mốc bàn tay trên trình duyệt cho cụm từ ký hiệu và game cử chỉ.'),
        s({ en: 'Gesture recognition', vi: 'Nhận diện cử chỉ' }, 'Fingertip-versus-joint geometry rules classify gestures.', 'Luật hình học đầu ngón so với khớp để phân loại cử chỉ.'),
        s('Web Speech API', 'Speech-to-text captions under voice rooms and speech synthesis for replies.', 'Phụ đề giọng nói dưới phòng thoại và đọc thành tiếng câu trả lời.'),
        s('sherpa-onnx ASR', 'On-device Vietnamese speech recognition in VoiceBridge.', 'Nhận dạng tiếng Việt ngay trên máy trong VoiceBridge.'),
        s('Piper TTS', 'On-device Vietnamese voice output.', 'Giọng đọc tiếng Việt ngay trên máy.'),
        s('Ollama', 'Optional short context suggestions with deterministic fallbacks.', 'Gợi ý ngữ cảnh ngắn tùy chọn, có phương án cố định khi tắt.'),
        s({ en: 'Offline-first fallbacks', vi: 'Fallback offline' }, 'Phrase models and context dictionaries run locally without external AI APIs.', 'Bộ mẫu câu và từ điển ngữ cảnh chạy local, không gọi API AI bên ngoài.'),
      ], true),
      g('Games & media', 'Game & media', [
        s('Three.js', '3D escape room and STEAM lab mini-games.', 'Mini-game escape room và phòng STEAM 3D.'),
        s({ en: 'Mini-game design', vi: 'Thiết kế mini-game' }, 'Quiz battle, trivia, bingo, lucky wheel, drawing, knowledge quest and cyber-safety games.', 'Quiz battle, trivia, bingo, vòng quay, vẽ tranh, phiêu lưu tri thức và game an toàn mạng.'),
        s('getUserMedia · Web Audio', 'Microphone input with an analyser for karaoke and live voice rooms.', 'Thu microphone kèm bộ phân tích cho karaoke và phòng thoại trực tiếp.'),
        s({ en: 'Hand-controlled play', vi: 'Chơi bằng tay' }, 'A flying game steered by the hand through the webcam.', 'Game bay điều khiển bằng bàn tay qua webcam.'),
      ]),
      g('Front end', 'Front-end', [
        s('React 19 · TypeScript', 'Mobile-shaped social app with rooms, messages, profiles, tasks, shop and leaderboards.', 'Ứng dụng social dạng mobile với phòng, tin nhắn, hồ sơ, nhiệm vụ, cửa hàng và bảng xếp hạng.'),
        s('Motion', 'Animated transitions across the app.', 'Chuyển cảnh động trong toàn ứng dụng.'),
        s('Tailwind CSS 4 · Vite 6', 'Styling and build tooling.', 'Styling và công cụ build.'),
      ]),
      g('Backend', 'Backend', [
        s('Flask', 'REST API with a JSON store for the local demo.', 'REST API với kho JSON cho bản demo local.'),
        s('Server-Sent Events', 'Real-time room updates pushed to the client.', 'Đẩy cập nhật phòng theo thời gian thực tới client.'),
        s('FastAPI · WebSocket', 'VoiceBridge service for streaming speech in and out.', 'Dịch vụ VoiceBridge truyền giọng nói vào và ra theo luồng.'),
      ]),
    ],
  },
  'vehicle-counting': {
    depth: 'pretrained',
    verdict: {
      en: 'A pretrained model, not fine-tuned. YOLOv8n trained on COCO detects six road-user classes; ByteTrack gives each one a persistent ID so a line zone counts every crossing once per direction.',
      vi: 'Dùng model pretrained, không fine-tune. YOLOv8n huấn luyện sẵn trên COCO nhận diện sáu nhóm người và phương tiện; ByteTrack gán ID bền vững để line zone đếm mỗi lượt cắt đúng một lần theo mỗi hướng.',
    },
    models: [
      m('YOLOv8n (Ultralytics, COCO)', 'pretrained',
        'Detects people, bicycles, cars, motorcycles, buses and trucks frame by frame.',
        'Nhận diện người, xe đạp, ô tô, xe máy, xe buýt và xe tải theo từng khung hình.'),
      m('ByteTrack', 'algorithm',
        'Associates detections across frames — including low-confidence boxes — into persistent track IDs.',
        'Liên kết kết quả nhận diện giữa các khung hình — kể cả box độ tin cậy thấp — thành ID theo dõi bền vững.'),
      m('Supervision LineZone', 'algorithm',
        'Counts a track once when it crosses the line, separately for each direction and class.',
        'Đếm một track đúng một lần khi cắt qua vạch, tách riêng theo hướng và theo lớp.'),
    ],
    groups: [
      g('Computer vision', 'Thị giác máy tính', [
        s('YOLOv8n', 'Real-time object detection with the pretrained COCO model.', 'Nhận diện đối tượng thời gian thực bằng model COCO pretrained.'),
        s('Ultralytics', 'Inference API, confidence thresholds and class filtering.', 'API suy luận, ngưỡng độ tin cậy và lọc lớp.'),
        s({ en: 'COCO class filtering', vi: 'Lọc lớp COCO' }, 'Keeps only people, bicycles, cars, motorcycles, buses and trucks.', 'Chỉ giữ người, xe đạp, ô tô, xe máy, xe buýt và xe tải.'),
        s('ByteTrack', 'Multi-object tracking with persistent IDs across frames.', 'Theo dõi nhiều đối tượng với ID bền vững qua các khung hình.'),
        s('Supervision', 'Detections, tracking glue, line zones and annotators.', 'Detections, kết nối tracking, line zone và bộ vẽ chú thích.'),
      ], true),
      g('Counting & video', 'Đếm & video', [
        s({ en: 'Directional line-zone counting', vi: 'Đếm theo hướng qua vạch' }, 'Separate up and down totals per class.', 'Tổng lượt lên và xuống riêng cho từng lớp.'),
        s({ en: 'Double-count prevention', vi: 'Chống đếm trùng' }, 'Persistent IDs stop the same object being counted twice in one direction.', 'ID bền vững giúp một đối tượng không bị đếm hai lần cùng một hướng.'),
        s('OpenCV', 'Frame-by-frame video reading and MP4 writing.', 'Đọc video từng khung và ghi file MP4.'),
        s('NumPy', 'Array handling for frames and coordinates.', 'Xử lý mảng cho khung hình và tọa độ.'),
        s({ en: 'Video annotation', vi: 'Chú thích video' }, 'Boxes, motion traces, labels, the line and live totals drawn on output.', 'Vẽ bounding box, vệt di chuyển, nhãn, vạch đếm và tổng trực tiếp lên video.'),
        s('Python', 'Single-script pipeline with a reproducible setup guide.', 'Pipeline một script kèm hướng dẫn thiết lập tái lập được.'),
      ]),
    ],
  },
  'task1-coach': {
    depth: 'pretrained',
    verdict: {
      en: 'One pretrained model, used offline and not fine-tuned: the Listening narration was generated locally with Piper TTS, and no voice model ships with the app. Practice, timers, recording and feedback run without AI, privately on the learner’s device.',
      vi: 'Một model pretrained, dùng offline và không fine-tune: giọng đọc Listening được sinh cục bộ bằng Piper TTS, ứng dụng không kèm model giọng nói nào. Luyện tập, đồng hồ, ghi âm và phản hồi chạy không cần AI, riêng tư trên thiết bị người học.',
    },
    models: [
      m('Piper TTS 1.8 · en_GB alba (medium)', 'pretrained',
        'Generated the MP3 narration for 30 original Listening scripts offline; the synthetic voice is credited and disclosed.',
        'Sinh giọng đọc MP3 cho 30 bài Listening nguyên bản một cách offline; giọng tổng hợp được ghi nguồn và nói rõ.'),
    ],
    groups: [
      g('AI content production', 'Sản xuất nội dung bằng AI', [
        s('Piper TTS', 'Offline synthetic narration for 30 Listening lessons.', 'Giọng đọc tổng hợp offline cho 30 bài Listening.'),
        s({ en: 'Voice licensing', vi: 'Giấy phép giọng đọc' }, 'CC BY 4.0 voice dataset credited; synthetic audio clearly disclosed.', 'Ghi nguồn dataset giọng CC BY 4.0; nói rõ audio là giọng tổng hợp.'),
      ], true),
      g('Learning product', 'Sản phẩm học tập', [
        s({ en: 'Curriculum design', vi: 'Thiết kế học liệu' }, '30 Reading, 30 Listening, 30 Speaking and 31 Writing units plus vocabulary and grammar.', '30 Reading, 30 Listening, 30 Speaking và 31 Writing cùng từ vựng và ngữ pháp.'),
        s({ en: 'Assessment design', vi: 'Thiết kế câu hỏi' }, '300 Listening questions with Vietnamese explanations and instant feedback.', '300 câu hỏi Listening có giải thích tiếng Việt và phản hồi tức thì.'),
        s({ en: 'Content licensing', vi: 'Giấy phép nội dung' }, 'Original and CC BY-SA adapted passages with sources kept and no false IELTS endorsement.', 'Bài đọc nguyên bản và chuyển thể CC BY-SA, giữ nguồn, không mạo nhận IELTS.'),
        s({ en: 'Source reconstruction', vi: 'Tái dựng mã nguồn' }, 'Rebuilt the original project and expanded it into a four-skill product.', 'Tái dựng dự án gốc và mở rộng thành sản phẩm đủ bốn kỹ năng.'),
      ]),
      g('Front end', 'Front-end', [
        s('React 19 · TypeScript', 'Responsive practice workspace with timers, notes and players.', 'Không gian luyện tập responsive có đồng hồ, ghi chú và trình phát.'),
        s('Expo (web)', 'Exported as a static site under the GitHub Pages base path.', 'Xuất thành site tĩnh theo base path của GitHub Pages.'),
        s('MediaRecorder', 'Speaking practice recordings kept on the device.', 'Ghi âm bài nói, lưu trên thiết bị.'),
        s({ en: 'Audio playback', vi: 'Phát audio' }, 'Real playback that resumes where the learner stopped.', 'Phát audio thật, tiếp tục đúng chỗ người học đã dừng.'),
        s('GSAP', 'Interface motion with reduced-motion support.', 'Chuyển động giao diện, hỗ trợ reduced motion.'),
      ]),
      g('Local-first data', 'Dữ liệu local-first', [
        s('IndexedDB', 'Drafts, answers, playback positions, recordings and preferences — no account, no server.', 'Bản nháp, đáp án, vị trí nghe, bản ghi và tùy chọn — không tài khoản, không server.'),
        s({ en: 'JSON backup & restore', vi: 'Sao lưu JSON' }, 'Portable progress between devices.', 'Mang tiến độ sang thiết bị khác.'),
      ]),
      g('Quality & delivery', 'Chất lượng & triển khai', [
        s('Playwright', 'Tests against the production build: layouts, audio, persistence, reduced motion and keyboard use.', 'Test trên bản production: bố cục, audio, lưu trữ, reduced motion và bàn phím.'),
        s('GitHub Pages', 'Static hosting with build-version tracking.', 'Lưu trữ tĩnh có theo dõi phiên bản build.'),
        s({ en: 'Accessibility', vi: 'Khả năng tiếp cận' }, 'Keyboard-friendly interaction and prefers-reduced-motion.', 'Thao tác thân thiện bàn phím và prefers-reduced-motion.'),
      ]),
    ],
  },
};
