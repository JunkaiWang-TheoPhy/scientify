---
name: paper-download
description: "Download academic papers: arXiv source/PDF by ID, DOI papers via Unpaywall open access. Supports batch download."
---

# Paper Download

将论文下载到当前工作目录的 `papers/` 下。

## arXiv 论文

**优先下载 .tex 源文件**（可读性远优于 PDF）：

```bash
mkdir -p papers/{arxiv_id}
curl -L "https://arxiv.org/src/{arxiv_id}" | tar -xz -C papers/{arxiv_id}
```

如果 tar 解压失败（部分论文只提供 PDF），回退到 PDF：

```bash
curl -L -o papers/{arxiv_id}.pdf "https://arxiv.org/pdf/{arxiv_id}"
```

> arXiv 限速：连续下载时每篇间隔 3 秒（`sleep 3`）。

## DOI 论文（通过 Unpaywall）

查询开放获取链接，有则下载，无则跳过：

```bash
curl -s "https://api.unpaywall.org/v2/{doi}?email=research@openclaw.ai" | \
  python3 -c "
import sys, json
d = json.load(sys.stdin)
oa = d.get('best_oa_location') or {}
url = oa.get('url_for_pdf') or oa.get('url')
if url: print(url)
else: print('NO_OA', file=sys.stderr)
" | xargs -I{} curl -L -o papers/{doi_slug}.pdf "{}"
```

> `{doi_slug}` = DOI 中的 `/` 替换为 `_`，例如 `10.1000/xyz123` → `10.1000_xyz123`。
> 非开放获取论文静默跳过，不报错。

## 批量下载

```bash
# 批量 arXiv
for id in 2401.12345 2403.00001 2405.67890; do
  mkdir -p papers/$id
  curl -L "https://arxiv.org/src/$id" | tar -xz -C papers/$id || \
    curl -L -o papers/$id.pdf "https://arxiv.org/pdf/$id"
  sleep 3
done
```

## 下载后

- 下载的论文 ID 应追加到 `config.json` 的 `processed_ids`（如果存在）
- 优先读 `.tex` 源码而非 PDF（信息更完整，公式可直接提取）
