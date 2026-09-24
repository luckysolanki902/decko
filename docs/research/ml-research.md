# ML curriculum audit: deep understanding, durable learning, and original work

Research and repository audit: 20 September 2026. Findings describe the pre-update course; implementation decisions below describe this revision.

## Verdict

The existing course is much more substantial than an API tutorial. It already includes classical ML, scratch neural networks, NLP, transformers, post-training, retrieval, agents, evaluation, and deployment. Its main weakness is that breadth is mistaken for enough time and an executable learning process. A day listing many research subjects does not establish that a beginner can derive, implement, remember, and transfer them.

For the requested goal, keep a common foundation, add missing dependency-safe modules, and develop a research habit throughout. Do not tell the learner they must master all of AI before building anything useful. A small product, a faithful reproduction, and a new scientific contribution require different kinds of evidence.

The user clarified that **Jev means TypeSafe's model**, linking its documentation. The case study below addresses that product directly. JEPA and V-JEPA are separate research examples; they are not Jev.

## Jev / TypeSafe: the concrete product lesson

TypeSafe describes Jev as a model for software-consumable decisions, exposed through Choice, Score and Noul primitives rather than a conversational text response. This is a useful example of changing the output contract to fit the consumer. These descriptions are vendor documentation, not an independent performance evaluation. [Introduction](https://docs.typesafe.ai/introduction).

Its primer describes its training approach as **reinforcement learning for calibrated decisions (RLCD)** and contrasts that objective with RLHF and verifiable-reward training. Treat RLCD as the vendor's stated approach: these pages do not provide enough architecture, data, objective implementation or controlled benchmark detail to reconstruct Jev's training recipe or establish superiority over alternatives. [TypeSafe AI primer](https://docs.typesafe.ai/introduction/machine-learning-primer).

The docs distinguish a distribution over outcomes from a derived `confidence` statistic. They explicitly caution that useful thresholds depend on the application. Our curriculum must teach that concentration, calibration, accuracy and expected decision cost are different properties; a highly peaked wrong distribution is possible. Test reliability on representative held-out data and relevant slices before using thresholds. [Confidence documentation](https://docs.typesafe.ai/confidence).

**Curriculum inference:** a learner aspiring to this kind of invention particularly needs probabilistic classification, proper scoring objectives, calibration, decision theory, representation learning, post-training, inference efficiency, evaluation under shift, and typed software interfaces. The documentation does not support the stronger claim that every creator must first master OpenCV, generative video and 3D. Those fields broaden the space of possible products, but are not prerequisites for every one.

Use three levels of a recurring educational project:

1. After classical classification, build a small decision service with a local model, held-out calibration analysis and a reject/review option. No vendor API is needed.
2. After NLP/LLMs, compare a sparse classifier, a small adapted model and a structured-output LLM on the same narrow routing task. Check both schema validity and semantic accuracy; include ambiguous and out-of-distribution inputs.
3. After RL/post-training, formulate and test an alternative objective on a toy problem. Compare error, calibration, coverage of automatic decisions, latency and expected cost under a fixed dataset and budget. Label this a pedagogical experiment, **not a Jev reproduction**.

The question to practise is: “Does this application need generated text, or a calibrated decision that ordinary code can combine with other evidence?” A typed interface alone does not answer the reliability question. A new training objective alone does not answer the product question. The learner must measure both.

Independent research supports teaching those distinctions. Guo et al. measured calibration failures and assessed post-processing methods on neural classifiers; temperature scaling helped in many of their experiments, not universally for every future distribution. [Calibration study](https://proceedings.mlr.press/v70/guo17a.html). Strictly proper scoring rules make reporting the true predictive distribution uniquely optimal in expectation under their assumptions; finite data, restricted models and optimization still matter. [Gneiting and Raftery](https://sites.stat.washington.edu/people/raftery/Research/PDF/Gneiting2007jasa.pdf). Selective classification explicitly studies the error-versus-coverage tradeoff when a model can reject cases. [Selective classification paper](https://arxiv.org/abs/1705.08500). These are foundations for evaluating decision products, not validation of Jev specifically.

## Audit scope and concrete findings

Examined `src/data/phases/ml/index.ts`, roadmap metadata, syllabus README, visible course cards, teaching/ML/revision guidelines, and `guidelines/lecture-generation.md`. Enumerated every phase and day, then closely inspected foundation mechanics, vision prerequisites, RLHF, generative coverage, and phase checkpoints. The user generates lectures on demand in batches of three: unwritten ML lectures are expected, not a defect. Existing WebD Days 13, 14, and 37 provide teaching examples; their quality cannot be automatically attributed to future ML output. This file is the requested new assessment, now organized under `docs/research/`.

| Finding | Repository evidence before changes | Consequence |
|---|---|---|
| Incorrect advertised length | Metadata says 200/800; actual phase data has 204 units/816 nominal hours | Syllabus ranges and progress expectations disagree |
| Programming prerequisite hidden by marketing | Guidelines assume pandas, NumPy, plots, statistics | An absolute programming beginner meets unexplained prerequisites |
| Passive-reading escape hatch | Day 2 explicitly says not understanding every line is the point | Conflicts with self-contained instruction and encourages copying |
| Premature tuning | First KNN lab sweeps `k` before a sound evaluation process | Encourages test-set selection unless repaired |
| Incorrect mechanism claims | Several early days imply all `.fit()` calls or linear regression use gradient descent | Learner builds a false model of library behavior |
| Vision dependency gap | ViT at old Day 89; explicit QKV attention at old Day 126 | Architecture lesson borrows a future mechanism |
| RL dependency gap | RLHF at old Day 149; general RL at old Day 195 | Reward, policy, return, and policy updates arrive in the wrong order |
| Image processing under-developed | Vision begins with convolution; no distinct OpenCV foundations | Data representation and classical vision are skipped |
| Generative scope compressed | One image/video/audio survey day; no explicit 3D sequence | Running models substitutes for understanding mechanisms |
| Research independence concentrated late | Research reading sprint near the end of post-training | Curiosity and alternative hypotheses are not practised consistently |
| Practice contract too small | Five recap reps in roughly 15 minutes | Useful refresher, insufficient independent evidence for a four-hour unit |
| Retention not operational | Strong general principles, little daily scheduling | Can repeatedly “understand” and later fail to reconstruct |

## Research basis and its limits

The learning-science basis is shared with [the DSA report](dsa-psychology.md): retrieval, spacing, guided examples, bounded attempts, calibrated confidence, and transfer checks. These findings support a design direction; they do not establish that this particular ML sequence or a fixed daily duration is optimal.

The strongest general recommendation is to combine retrieval with distributed practice. Apply it to shapes, assumptions, derivations, and debugging decisions, not only terminology. [Dunlosky et al.](https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html). Alternate worked examples with independent tasks as competence develops. [IES practice guide](https://ies.ed.gov/ncee/wwc/practiceguide/1). Treat problem-first preparation as a structured instructional choice with follow-up teaching, not a universal ban on explanation. [Sinha and Kapur](https://journals.sagepub.com/doi/abs/10.3102/00346543211019105).

Technical sources were primary papers, official documentation, and university curricula. University schedules inform coverage and dependency comparisons; they are not experiments proving this course's pedagogy. Paper results apply to their stated tasks, models, datasets, and compute budgets. None establishes a guaranteed path to frontier discovery.

## History should teach changing assumptions

The useful historical story is not “ML suddenly appeared, then LLMs replaced it.” Teach a sequence of questions: when do hand-written rules fail; what can be learned from labelled examples; what representations must be supplied versus learned; how can unlabelled data provide a training signal; and how should a learned model support decisions or generation?

Use the original course's generative-versus-discriminative comparison early. Later connect sparse text classifiers, learned embeddings, sequence models, and attention. Show that a method can remain useful after a more expressive family appears: a cheap calibrated classifier or a geometric vision pipeline may better fit a product's constraints.

An original perspective often changes **representation, objective, data, assumptions, or evaluation**, not simply parameter count. I-JEPA predicts representations of missing image regions rather than directly reconstructing pixels. That makes it a useful contrast with image generation, not proof that one family universally supersedes another. [I-JEPA paper](https://arxiv.org/abs/2301.08243).

V-JEPA 2 studies video representations, prediction, and action-conditioned planning. Its reported planning setup is evidence for specific capabilities, not proof of a general simulator or humanlike understanding. A course should compare observation prediction, action-conditioned prediction, and closed-loop control explicitly. [V-JEPA 2 paper](https://arxiv.org/abs/2506.09985).

## An honest route from scratch

“From scratch” has two meanings. This ML course can begin with no ML knowledge, but Python syntax, tabular manipulation, and elementary numerical reasoning still need an entry route. Provide a readiness guide linking to the repository's DAML course rather than pretending these prerequisites disappear.

Before ML Day 1, the learner should independently: write a function and loop; load a small table; identify missing values; select rows and columns; create and index a numeric array; explain its shape; compute a mean; and read a basic plot. Diagnose each separately. A gap sends the learner to the relevant Python/NumPy/pandas/statistics work, not the entire analytics syllabus or a vague instruction to “learn math.”

Do not require calculus first. Keep an understandable first model early, but explain every operation used. Delay optimization internals while making input, output, fitting, prediction, held-out evaluation, and a simple baseline concrete. New syntax is not a permissible black box. Later math lessons can explain the mechanism of specific earlier estimators accurately.

Correct the original implication that ordinary `LinearRegression` is universally fitted with gradient descent. Dense ordinary least squares in scikit-learn uses a least-squares solver; stochastic gradient methods belong to different estimators. Avoid explicit matrix inversion as the default implementation. [Official API documentation](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html).

## A dependency-safe technical expansion

The update preserves the ten broad phases and existing coverage. It adds 24 numbered units to the actual 204-unit baseline: four in vision, eight in reinforcement learning before post-training, and twelve in generative/spatial/research work. The resulting **228 units / 912 nominal first-pass hours** are planning estimates, not a deadline or a claim of universal mastery.

| Area | Why it matters | Required evidence |
|---|---|---|
| OpenCV and image representation | Image failures often begin before the network | Correct color order, ranges, resize/crop geometry, and annotations |
| Classical vision | Supplies alternatives to neural solutions | Evaluate filtering, thresholds, morphology, matching, and geometric failure cases |
| Attention before ViT | Removes a concrete forward dependency | Hand trace and implement tiny QKV attention before patch tokens |
| RL before RLHF | Makes policies, rewards, value estimates, and updates meaningful | Bandit, tabular control, policy-gradient and PPO toy experiments |
| Flow matching | Adds another way to formulate generative transport | Learn a toy velocity field and inspect numerical integration error |
| Video generation | Time adds failure modes absent from still images | Short sequence model, temporal diagnostics, conditioned evaluation |
| Cameras and 3D | Multiple images must agree about a scene | Projection, rays, depth ambiguity, geometry and held-out views |
| NeRF and Gaussian splatting | Different scene representations and renderers | Tiny reconstruction and comparable view/quality/cost analysis |
| Text/image-to-3D | Connects generative priors with spatial representations | Multi-view consistency, geometry, and export evaluation |
| World models | Prediction and control are different objectives | Controlled action-conditioned experiment and rollout error analysis |
| Research experiments | Turns curiosity into falsifiable work | Matched baseline, ablation, uncertainty, negative results, reproducibility |

OpenCV's official curriculum includes image processing, features, calibration, and reconstruction. Treat it as a toolbox with mechanisms, not another API list. [Official tutorials](https://docs.opencv.org/4.x/d9/df8/tutorial_root.html), [camera calibration](https://docs.opencv.org/4.13.0/dc/dbb/tutorial_py_calibration.html). Stanford's vision schedule is a useful coverage comparison, not an expectation that all of vision fits into a few beginner sessions. [CS231n schedule](https://cs231n.stanford.edu/2025/schedule.html).

For RL, build bandits → states/actions/rewards/returns → Bellman reasoning → tabular learning → neural value learning → policy gradients → actor-critic/PPO → reward design. Only then map these objects onto preference-trained language models. [Spinning Up foundations](https://spinningup.openai.com/en/latest/spinningup/rl_intro.html), [policy optimization](https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html). The InstructGPT paper supplies an explicit SFT/reward-model/RL pipeline. DPO supplies a different preference-optimization formulation; do not teach it as “PPO without knowing RL” or as universally superior. [InstructGPT](https://arxiv.org/abs/2203.02155), [DPO](https://arxiv.org/abs/2305.18290).

Flow matching trains vector fields along probability paths; it provides a useful contrast to a discrete denoising construction. Introduce the needed differential-equation and integration ideas locally. [Flow Matching](https://arxiv.org/abs/2210.02747). Video diffusion extends generation to temporally structured data; short clips and controlled synthetic motion are appropriate educational scales. [Video Diffusion Models](https://arxiv.org/abs/2204.03458).

NeRF represents a scene for novel-view synthesis through a neural radiance field. Gaussian splatting uses a different scene representation and rendering approach. Neither is synonymous with generating an arbitrary new 3D object from text. [NeRF project](https://www.matthewtancik.com/nerf), [3D Gaussian Splatting project](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/). DreamFusion is a concrete text-to-3D research example using a 2D diffusion prior; inspect its geometry and multi-view limitations rather than presenting a pleasing single view as success. [DreamFusion](https://arxiv.org/abs/2209.14988).

Generative 3D therefore already has research precedents. The future question is which representations, conditioning, physical constraints, data, and evaluation will make it more controllable and useful. This course should enable informed experiments, not predict which architecture will win.

## Teach memory and independence through the work itself

The stored generation prompt is part of the curriculum. Its obsolete paths, 12-lecture example, fixed 4,000–4,500-line target, and generic instruction to reproduce “learning psychology” need replacement. The new contract should generate the requested three units sequentially, in topic-sized chunks, and leave a compact handoff naming what was actually taught, prerequisites repaired, review cues, and the next unit. It must not fabricate learner scores or equate generated material with completed study.

WebD Day 37 demonstrates the desired derivation quality: a working attempt, a concrete failure, and a tool that solves the now-visible problem. Earlier reference lectures also contain patterns now discouraged by the guidelines, including long agenda-like openers and examples borrowing upcoming material. Reference files are examples to analyze, not templates to copy uncritically. Review must check both immediate explanation quality and continuity across batches.

Every concept beat needs a required output before feedback: predict a shape, compute a tiny value, choose between explanations, sketch a baseline, or name an assumption. Reveal the explanation afterward. Never replace this with “think about it” while the answer is already alongside it.

A concrete loss-function sequence: predict which of two errors receives the larger penalty; calculate on three values; inspect a graph; implement the loss; check against a library under matching reduction conventions; deliberately introduce a bug; return a week later and reconstruct the central expression without the original notebook. A changed dataset then tests transfer. All of those actions are distinct from rereading the derivation.

Use a review queue with at most two new prompts per session and a 15–20-minute ordinary review cap. Start with approximately 1/3/7/14/30-day revisits, adapting to success and failure. These are design defaults. Prompts should target dependencies needed next: shape reasoning before backprop, log-probability before cross-entropy, policy/return before RLHF.

Maintain four separate records: coverage, immediate performance, delayed reconstruction, and transfer. A polished notebook may establish coverage and execution while providing weak evidence for the other two. Record whether code was independent, hinted, copied-and-understood, or not yet understood.

## Pace, confidence, and the “winning effect”

A useful win is evidence that the learner can influence an outcome: fix a shape mismatch from a trace, beat an honest baseline, discover that an exciting idea fails, or reproduce a result within justified tolerance. A negative result can be a methodological win. A high test score obtained through leakage is not one.

Do not promise neurochemical motivation or a universal winning-effect formula. Use small mastery experiences, clear next actions, and permission to seek targeted help. The self-efficacy rationale is an interpretation of psychological research, not proof that accepting a model output will build durable confidence. [Bandura](https://dradamvolungis.com/wp-content/uploads/2011/06/self-efficacy-unifying-theory-of-behavioral-change-bandura-1977.pdf).

For a four-hour unit allocate roughly 20 minutes to retrieval, 70 to explanation and derivation, 100 to implementation and experiments, 30 to feedback, and 20 to reconstruction and planning. Breaks are additional; a unit can span several days. If an advanced topic exceeds that budget, take more sessions instead of removing the derivation. The five short practice reps remain a warm-up, not the whole practical workload.

At 8 hours/week, 912 hours is about 114 weeks; at 16 hours/week, about 57 weeks; at 24 hours/week, about 38 weeks. These arithmetic estimates exclude the programming bridge, extra review, remediation, larger projects, and specialization. The course should display units and baseline effort honestly so slower study does not look like falling behind.

## Curiosity as an observable skill

Each phase should leave a question log. Each entry contains: observation, at least two possible explanations, the smallest experiment that distinguishes them, expected outcomes, measured outcomes, and revised belief. Ask “What would change my mind?” before running the experiment.

For example, if image classification improves after augmentation, possible explanations include greater robustness, accidental leakage changes, altered effective training time, or random variation. Hold the split and training budget fixed, inspect examples, repeat with multiple seeds where affordable, and measure the relevant slice. Do not declare a general architectural discovery from one run.

Use a perspective checklist after a baseline: Could better data solve this? Could a rule or classical model suffice? Is the representation wrong? Is the objective aligned with the product? Is a generative output needed, or would prediction/ranking/control suffice? What metric could reward the wrong behavior? These questions train alternative thinking without demanding novelty on every day.

Paper reading should progress from one figure and a reproducible claim to methods, assumptions, baselines, ablations, and limitations. Reading ten abstracts is not equivalent to reproducing one claim. A small reproduction can be excellent; label any reduced dataset, budget, architecture, or metric that prevents direct comparison.

## Compute should not decide who is allowed to learn

Every expensive lab needs a CPU or small-data route that still exercises the mechanism, plus an optional accelerated route with an explicit time/memory budget. A screenshot of pretrained output or an unexecuted plan is not equivalent evidence to training a model.

Examples: train a tiny network on synthetic data; implement a toy diffusion or velocity field; fit a tiny radiance scene; inspect a supplied checkpoint and reproduce one forward pass; analyze provided experiment traces when a full training run is infeasible. State exactly which competence each route demonstrates and which remains untested. Do not require buying compute to pass the core course.

## Gates and capstones

At each phase boundary require a short closed-notes explanation, one executable independent artifact, one deliberate failure diagnosis, and a delayed changed-task check. Use a dependency repair route if a critical skill fails. Quizzes supplement this evidence; they do not replace it.

The final product must answer a real use case, compare against a cheap baseline, justify model choice, report errors and uncertainty, show deployment constraints, and record a reproducible experiment. A research extension additionally requires a falsifiable new hypothesis and fair comparison. An attractive demo alone proves neither scientific novelty nor production readiness.

Breadth plus one deep specialization is a sensible first outcome. Later extensions can include causal inference, probabilistic modeling, advanced RL/control, scientific ML, robotics, optimization, or large-scale training. They should be added because of a problem and prerequisite graph, not because a trending model exists.

## Changes and remaining limits

The accompanying update changes phase data, counts, visible cards, syllabus documentation, learner study guidance, and authoring rules. It makes rehearsal and transfer requirements visible in every unit, fixes selected incorrect foundation claims, adds the missing sequences, and generates accurate phase ranges from the actual data.

Lecture generation remains on demand in three-unit batches. This update does not train frontier models or empirically validate the redesigned course. Because ML numbering expands, existing progress stored by numeric day IDs may need a separate migration before a deployed rollout; this local curriculum change does not alter database records. Each future batch must verify prerequisites and runnable examples topic by topic and carry its teaching/review handoff forward.

Following the explicit first-batch request, ML Days 1–3 now exist in `public/data/lectures/ml/phase1/`: a transparent learned rule, hand-traced/scratch/library neighbor voting with honest held-out evaluation, then generalization and leakage diagnosis with validation-based selection. They preserve the Python/data entry bridge and introduce no assumed calculus. The [batch handoff](../../src/data/syllabus/mlroadmap/generation-handoff.md) records actual prerequisites, executable checks and limitations. Runnable lessons are not evidence of a learner's independent or delayed competence.
