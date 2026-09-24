# ML, DL and Generative AI — Syllabus

## Outcome and entry

Learn ML from first principles, then build and evaluate systems across classical ML,
neural networks, vision, NLP, RL, LLMs, decision models, generative images/video/3D,
and production. The goal is independent reasoning and useful experiments, not merely
running libraries or completing a list of topics.

**10 phases · 228 study units · 912 nominal first-pass hours.** A numbered day is an
ordered study unit, not a calendar deadline. Review, prerequisite preparation,
remediation, substantial projects and specialization add time.

No prior ML is assumed. Use the [readiness bridge and study system](01-Study-System.md)
to establish Python, NumPy, pandas, basic plots and elementary statistics. The route
points to the relevant DAML material; completing every analytics tool is not required.
Linear algebra, calculus and modeling concepts are derived inside this course.

Lectures are generated on demand in batches of three using the
[generation prompt](../../../../guidelines/lecture-generation.md). Existing WebD lectures are teaching
references, not templates exempt from current rules. Each batch checks previous
teaching, writes in topic-sized chunks and leaves a factual authoring/review handoff.
A file's existence does not establish learner completion.

## Active sequence

These ranges match `src/data/phases/ml/index.ts`, the source of truth.

| Phase | Numbered units | Count | Focus |
|---|---|---:|---|
| 1 | 1-24 | 24 | Mental model, generalization, just-enough math, linear regression and classification from scratch, validation discipline, capstone |
| 2 | 25-44 | 20 | KNN, Naive Bayes, trees, forests, gradient boosting, XGBoost/LightGBM/CatBoost, SVMs, pipelines, tuning, calibration, interpretation, packaging |
| 3 | 45-64 | 20 | PCA, clustering, anomaly detection, recommenders, embeddings, vector search, hybrid retrieval, labeling loops |
| 4 | 65-84 | 20 | Micrograd, manual backprop, MLPs, initialization, optimizers, normalization, PyTorch, debugging, tracking, scaling |
| 5 | 85-108 | 24 | OpenCV, image processing and geometry, CNNs, attention before ViTs, detection, segmentation, self-supervised and multimodal perception |
| 6 | 109-128 | 20 | Tokenization, n-grams, TF-IDF, word2vec, GloVe, sequence labeling, parsing, RNNs, LSTMs, seq2seq, attention, QA, summarization |
| 7 | 129-148 | 20 | Self-attention, transformer blocks, BERT, GPT, T5, tokenizers, scaling laws, pretraining, decoding, HF internals, PEFT, tiny GPT |
| 8 | 149-176 | 28 | Bandits, MDPs, value learning, policy gradients and PPO before RLHF; SFT, DPO, calibrated decisions, evaluation and serving |
| 9 | 177-196 | 20 | RAG architecture, ingestion, chunking, embeddings, vector stores, hybrid search, reranking, grounded generation, tool use, agents, observability, security |
| 10 | 197-228 | 32 | VAEs, GANs, diffusion, flow matching, video, cameras, NeRF, Gaussian splatting, text-to-3D, world models, research studios and MLOps |

The first phase intentionally trains an understandable model early, then revisits
the mechanics. It does not assume the learner understands unexplained code or tune
against a supposedly held-out test set. Later phases retain scratch implementations,
library comparisons, failure analysis and capstones.

## Key dependency chains

- Python/data readiness → first fixed model and honest baseline → shapes, calculus,
  probability, losses and scratch linear models.
- Arrays and geometry → image processing/OpenCV → CNNs → explicit attention bridge
  → ViTs and multimodal perception.
- Probability and neural nets → bandits → MDPs/Bellman reasoning → tabular and neural
  value learning → policy gradients → actor-critic/PPO → RLHF and preference optimization.
- Generative foundations → diffusion → numerical dynamics/flow matching → video
  → cameras and multi-view geometry → NeRF/Gaussian splatting → text/image-to-3D.
- Small models and experimental discipline → competing explanations → controlled
  ablations → a bounded paper reproduction → a defensible product/research decision.

A future lecture may name a later field to motivate curiosity, but cannot use its
mechanism as assumed knowledge. If a prerequisite is missing, teach a small complete
bridge before first use or change the example.

## Durable learning contract

Every unit includes a learner-produced prediction before feedback, hand-worked
mechanics, runnable implementation, a deliberate failure and an independent changed
task. Retrieve recent and older prerequisites. Add at most two durable prompts per
study session and keep ordinary daily review within about 15–20 minutes.

Start delayed reviews around 1/3/7/14/30 days after actual study, adapting to recall
and workload. These are design defaults, not experimentally optimal intervals.
Record assistance, delayed reconstruction and transfer separately from coverage.
An overloaded review queue calls for less new content, not more guilt.

A phase gate requires a closed-notes explanation, independent artifact, diagnosed
failure and delayed transfer check. Preserve depth by taking extra sessions when
needed. Five quick recap reps are useful, but are not the entire practice allocation.

## Jev and alternative ways of building AI

The [research report](../../../../docs/research/ml-research.md) examines TypeSafe/Jev directly,
alongside JEPA/world-model research as a separate subject. Jev is a useful case for
asking whether a product needs generated prose or decisions that software consumes.

Teach probability, calibration, abstention, decision cost, training objectives and
typed interfaces before asking learners to judge decision-model claims. Compare
rules, classical models, small adapted models and text-generating systems on the
same narrow task. Vendor descriptions of RLCD are not a disclosed training recipe
or independent evidence of superiority. The course does not claim to reproduce Jev.

## Depth and compute

Each major mechanism passes through motivation → tiny example → derivation →
implementation → reference comparison → failure diagnosis → delayed changed task.
Match reference settings and use justified numerical tolerances. Stochastic training
runs need not produce identical weights or trajectories.

Every expensive lab needs an executable CPU/small-data path plus optional accelerated
work with a stated budget. Distinguish training, inference, checkpoint inspection and
analysis of supplied results. An unexecuted plan is not a completed implementation.
A toy lab proves a bounded mechanism, not frontier-scale reproduction.

The final portfolio includes a real use case, a cheap baseline, error analysis,
uncertainty, compute/latency costs, data lineage and a reproducible decision. A research
extension adds a falsifiable hypothesis, competing explanation and fair comparison.
Broad competence plus one deep specialization is the intended first outcome.

## Research and authoring references

Read [the ML research report](../../../../docs/research/ml-research.md) for the audited findings, evidence
limits and claim-level links to research. The technical sources include official
OpenCV documentation, Stanford vision/NLP curricula, RL foundations, the InstructGPT
and DPO papers, flow matching, video diffusion, NeRF, Gaussian splatting, DreamFusion
and JEPA research. Learning-science sources support retrieval, spacing and guided
practice; they do not guarantee this exact sequence or completion time.

Use [ML authoring rules](../../../../guidelines/ml.md),
[teaching method](../../../../guidelines/teaching-method.md), and
[study system](01-Study-System.md) when generating each batch. Current phase data wins
over historical day numbers. Do not copy old 200-day/800-hour ranges: the prior data
already contained 204 units before this expansion added 24.

## Integration note

This revision changes later ML day numbers and derives phase starts and total hours
from the actual unit counts. Before a deployed rollout with existing learner progress,
map any persisted numeric day IDs to the corresponding topic; this local syllabus
update does not migrate database records. Lecture files are generated when requested,
with titles and filenames taken from the current phase data.
