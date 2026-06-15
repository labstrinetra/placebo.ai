# MBBS Dataset Quality & Filtering Report
**Generated on:** 2026-06-03 14:02:43

This report identifies blurry, blank, low-visibility, and non-useful pages (such as Tables of Contents, Indices, and Front Matter) across the MBBS textbook library to ensure indexing them does not degrade the chatbot's retrieval quality.

## 1. Executive Summary
| Metric | Value | percentage | Description |
| :--- | :--- | :--- | :--- |
| **Total Books Analyzed** | 39 | - | Complete MBBS textbook set |
| **Total Raw Pages** | 24,348 | 100.0% | Combined page count |
| **Vector-text Pages** | 23,156 | 95.1% | High-fidelity selectable text |
| **Scanned/Image-only Pages** | 1,192 | 4.9% | Pages requiring OCR/VLM |
| **Total Excluded Pages** | 862 | 3.5% | Filtered out to protect quality |
| **Total Clean Pages** | 23,486 | 96.5% | Ingested into chatbot model |

### Break-down of Excluded Pages
| Exclusion Category | Page Count | % of Raw Pages | Rationale |
| :--- | :--- | :--- | :--- |
| **Blurry/Low-Visibility Pages** | 41 | 0.17% | Fails OpenCV sharpness check (Laplacian Var < 120) |
| **Blank/Low-Content Pages** | 129 | 0.53% | No text or image features present |
| **Table of Contents (TOC)** | 284 | 1.17% | Structural navigation page (pollutes RAG keyword matches) |
| **Subject/Term Indices** | 400 | 1.64% | List of page references (pollutes RAG keyword matches) |
| **Copyright/Front Matter** | 8 | 0.03% | Bibliographic page without clinical information |

## 2. Processing & Indexing Time Estimates
Estimated time required to process and index the **clean pages** in the chatbot model:

| Configuration | VLM (Visual Diagrams) | Hardware | Est. Speed | Total Time |
| :--- | :--- | :--- | :--- | :--- |
| **A. Text-Only Indexing (Direct)** | Disabled | GPU (Local Ollama) | 30 pages/sec | **~30 mins** |
| **B. Text-Only Indexing (Direct)** | Disabled | CPU (Local Ollama) | 3-5 pages/sec | **~4 hours** |
| **C. Full Multimodal (OCR + VLM)** | Enabled | GPU (Local Ollama) | 2-4 seconds/page | **~10-12 hours** |
| **D. Full Multimodal (OCR + VLM)** | Enabled | CPU (Local Ollama) | 15-20 seconds/page | **~50-60 hours** |

## 3. Subject-wise Details

### Subject: `ENT`
- **Books:** 4
- **Raw Pages:** 947 | **Excluded:** 38 | **Clean Pages:** 909

| Book Title | Raw | Clean | Blurry | Blank | TOC | Index | Front Matter |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| An Atlas of Investigation and Management of ENT (1).pdf | 116 | 108 | 0 | 0 | 2 | 6 | 0 |
| An Atlas of Investigation and Management of ENT.pdf | 116 | 108 | 0 | 0 | 2 | 6 | 0 |
| Maqbool_s-Textbook-of-ENT.pdf | 451 | 433 | 1 | 8 | 4 | 4 | 1 |
| ear_nose_and_throat_the_offici_sfo_uk_compressed.pdf | 264 | 260 | 0 | 3 | 1 | 0 | 0 |

### Subject: `EMBRYOLOGY`
- **Books:** 4
- **Raw Pages:** 1,407 | **Excluded:** 23 | **Clean Pages:** 1,384

| Book Title | Raw | Clean | Blurry | Blank | TOC | Index | Front Matter |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Human Embryology by Yogesh Sontakke.pdf | 329 | 322 | 0 | 0 | 1 | 6 | 0 |
| Inderbir Singh Human Embryology.pdf | 377 | 362 | 0 | 0 | 7 | 8 | 0 |
| Netter_s Atlas of Human Embryology.pdf | 318 | 317 | 0 | 0 | 1 | 0 | 0 |
| Vishram Singh Embryology.pdf | 383 | 383 | 0 | 0 | 0 | 0 | 0 |

### Subject: `NEUROSCIENCE`
- **Books:** 1
- **Raw Pages:** 913 | **Excluded:** 16 | **Clean Pages:** 897

| Book Title | Raw | Clean | Blurry | Blank | TOC | Index | Front Matter |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Introduction_to_Behavioral_Neuroscience-WEB.pdf | 913 | 897 | 0 | 1 | 6 | 9 | 0 |

### Subject: `PHARMACOLOGY`
- **Books:** 17
- **Raw Pages:** 9,859 | **Excluded:** 350 | **Clean Pages:** 9,509

| Book Title | Raw | Clean | Blurry | Blank | TOC | Index | Front Matter |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 289579.pdf | 368 | 323 | 29 | 14 | 1 | 0 | 1 |
| 9783839462492.pdf | 127 | 119 | 0 | 6 | 2 | 0 | 0 |
| Basic and Clinical Pharmacology, 14th Edition.pdf | 1264 | 1185 | 0 | 8 | 9 | 62 | 0 |
| Clinical_Ocular_Pharmacology_5Ed_2007_-_Jimmy_D._Bartlett.pdf | 777 | 748 | 0 | 0 | 2 | 27 | 0 |
| Color_Atlas_of_Pharmacology,_3rd_Edn.pdf | 414 | 384 | 0 | 0 | 5 | 22 | 3 |
| Katzungs-Basic-and-Clinical-Pharmacology-Lange-Medical-Books-16e-Nov-21-2023_1260463303_McGraw-Hill-McGraw-Hill-2023.pdf | 1841 | 1831 | 0 | 1 | 9 | 0 | 0 |
| L-G-0013389732-0037465327.pdf | 30 | 26 | 0 | 0 | 4 | 0 | 0 |
| Modern Pharmacology With Clinical Applications.pdf | 811 | 795 | 0 | 10 | 6 | 0 | 0 |
| Pharma Mnemonics King Khan share by MBBS Cafe.pdf | 358 | 306 | 0 | 0 | 52 | 0 | 0 |
| Pharmacology 7 days.pdf | 160 | 159 | 0 | 0 | 1 | 0 | 0 |
| Pharmacology-And-Pharmacotherapeutics-Tenth-Edition.pdf | 457 | 457 | 0 | 0 | 0 | 0 | 0 |
| RANG-AND-DALES-Pharmacology.-JAMES-M.-RITTER-DPhil.pdf | 761 | 758 | 0 | 0 | 3 | 0 | 0 |
| REMSA-Paramedic-Program-Drug-List-Revised-July-2023.pdf | 50 | 50 | 0 | 0 | 0 | 0 | 0 |
| Stasl’s Essential Psychopharmacology Neuroscientific Basis and Practical Applications, Stephen M. Staci (2021).pdf | 640 | 624 | 0 | 3 | 4 | 9 | 0 |
| Understanding_adverse_effects_of_Medicines_ebook_V1.pdf | 96 | 87 | 0 | 9 | 0 | 0 | 0 |
| clinical-pharmacy-and-therapeutics-by-cate-whittlesea-karen-hodson-z-lib.org_.pdf | 1112 | 1096 | 0 | 0 | 8 | 8 | 0 |
| katzung 1.pdf | 593 | 561 | 0 | 0 | 6 | 25 | 1 |

### Subject: `PHYSIOLOGY`
- **Books:** 13
- **Raw Pages:** 11,222 | **Excluded:** 435 | **Clean Pages:** 10,787

| Book Title | Raw | Clean | Blurry | Blank | TOC | Index | Front Matter |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1669720301Guyton and Hall 2021 Textbook of Medical Physiology 14th Ed.pdf | 1028 | 1023 | 0 | 0 | 4 | 1 | 0 |
| AK Jain Practical.pdf | 160 | 160 | 0 | 0 | 0 | 0 | 0 |
| AK Jain Textbook of Physiology.pdf | 1156 | 1131 | 10 | 0 | 5 | 10 | 0 |
| Anatomy_and_Physiology_2e_-_WEB_c9nD9QL.pdf | 1317 | 1272 | 1 | 2 | 23 | 19 | 0 |
| Berne and Levy Physiology.pdf | 884 | 840 | 0 | 0 | 8 | 36 | 0 |
| Best and Taylor The Physiologic Basis of Medical Practice.pdf | 1317 | 1268 | 0 | 0 | 22 | 26 | 1 |
| Bijlani 4ed.pdf | 825 | 793 | 0 | 18 | 9 | 5 | 0 |
| Boron Boulpaep Medical Physiology.pdf | 1351 | 1298 | 0 | 1 | 8 | 43 | 1 |
| C-GUYTON &HALL.pdf | 1152 | 1053 | 0 | 24 | 26 | 49 | 0 |
| CC Chatterjee Vol.1.pdf | 594 | 565 | 0 | 3 | 19 | 7 | 0 |
| CC Chatterjee Vol.2.pdf | 538 | 509 | 0 | 6 | 15 | 8 | 0 |
| CL Ghai Practical Physiology.pdf | 406 | 384 | 0 | 12 | 6 | 4 | 0 |
| Costanzo_s Physiology.pdf | 494 | 491 | 0 | 0 | 3 | 0 | 0 |

## 4. Page-by-Page Exclusion Audit Lists
This section contains the exact page numbers excluded from the indexing pipeline for each textbook:

### Subject Exclusions: `ENT`

#### **An Atlas of Investigation and Management of ENT (1).pdf**
- **Table of Contents:** 5, 6
- **Index Pages:** 111, 112, 113, 114, 115, 116

#### **An Atlas of Investigation and Management of ENT.pdf**
- **Table of Contents:** 5, 6
- **Index Pages:** 111, 112, 113, 114, 115, 116

#### **Maqbool_s-Textbook-of-ENT.pdf**
- **Blurry/Low-Visibility (OpenCV):** 261
- **Blank Pages:** 3, 7, 9, 11, 13, 17, 164, 260
- **Table of Contents:** 14, 16, 20, 33
- **Index Pages:** 447, 449, 450, 451
- **Copyright / Front Matter:** 12

#### **ear_nose_and_throat_the_offici_sfo_uk_compressed.pdf**
- **Blank Pages:** 193, 226, 235
- **Table of Contents:** 4

### Subject Exclusions: `EMBRYOLOGY`

#### **Human Embryology by Yogesh Sontakke.pdf**
- **Table of Contents:** 8
- **Index Pages:** 323, 324, 325, 326, 327, 328

#### **Inderbir Singh Human Embryology.pdf**
- **Table of Contents:** 12, 13, 14, 15, 16, 39, 43
- **Index Pages:** 368, 370, 371, 372, 373, 374, 375, 376

#### **Netter_s Atlas of Human Embryology.pdf**
- **Table of Contents:** 13

### Subject Exclusions: `NEUROSCIENCE`

#### **Introduction_to_Behavioral_Neuroscience-WEB.pdf**
- **Blank Pages:** 1
- **Table of Contents:** 3, 6, 7, 8, 9, 10
- **Index Pages:** 903, 904, 907, 908, 909, 910, 911, 912, 913

### Subject Exclusions: `PHARMACOLOGY`

#### **289579.pdf**
- **Blurry/Low-Visibility (OpenCV):** 10, 12, 34, 66, 100, 140, 162, 164, 174, 194, 238, 260, 282, 284, 314, 316, 322, 332, 334, 338, 340, 346, 348, 354, 356, 360, 362, 364, 366
- **Blank Pages:** 8, 32, 98, 173, 191, 192, 237, 313, 321, 329, 330, 337, 345, 353
- **Table of Contents:** 9
- **Copyright / Front Matter:** 4

#### **9783839462492.pdf**
- **Blank Pages:** 11, 25, 85, 125, 126, 127
- **Table of Contents:** 6, 7

#### **Basic and Clinical Pharmacology, 14th Edition.pdf**
- **Blank Pages:** 9, 13, 102, 290, 380, 604, 806, 1188
- **Table of Contents:** 4, 5, 6, 7, 23, 57, 58, 106, 167
- **Index Pages:** 1197, 1198, 1199, 1200, 1201, 1202, 1203, 1204, 1205, 1206, 1207, 1208, 1209, 1210, 1211, 1212, 1213, 1214, 1215, 1216, 1217, 1218, 1220, 1221, 1222, 1223, 1224, 1225, 1226, 1227, 1228, 1229, 1230, 1233, 1234, 1235, 1236, 1237, 1238, 1239, 1240, 1241, 1242, 1243, 1244, 1245, 1246, 1248, 1249, 1250, 1251, 1253, 1255, 1256, 1257, 1258, 1259, 1260, 1261, 1262, 1263, 1264

#### **Clinical_Ocular_Pharmacology_5Ed_2007_-_Jimmy_D._Bartlett.pdf**
- **Table of Contents:** 29, 34
- **Index Pages:** 745, 746, 747, 749, 750, 751, 752, 753, 754, 757, 758, 759, 760, 761, 762, 763, 765, 766, 767, 768, 771, 772, 773, 774, 775, 776, 777

#### **Color_Atlas_of_Pharmacology,_3rd_Edn.pdf**
- **Table of Contents:** 6, 7, 8, 9, 10
- **Index Pages:** 393, 394, 395, 396, 397, 398, 399, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414
- **Copyright / Front Matter:** 2, 3, 13

#### **Katzungs-Basic-and-Clinical-Pharmacology-Lange-Medical-Books-16e-Nov-21-2023_1260463303_McGraw-Hill-McGraw-Hill-2023.pdf**
- **Blank Pages:** 391
- **Table of Contents:** 24, 28, 72, 73, 74, 125, 126, 147, 238

#### **L-G-0013389732-0037465327.pdf**
- **Table of Contents:** 7, 10, 11, 12

#### **Modern Pharmacology With Clinical Applications.pdf**
- **Blank Pages:** 6, 87, 154, 156, 284, 286, 428, 514, 681, 683
- **Table of Contents:** 4, 7, 29, 30, 55, 95

#### **Pharma Mnemonics King Khan share by MBBS Cafe.pdf**
- **Table of Contents:** 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53

#### **Pharmacology 7 days.pdf**
- **Table of Contents:** 4

#### **RANG-AND-DALES-Pharmacology.-JAMES-M.-RITTER-DPhil.pdf**
- **Table of Contents:** 71, 72, 73

#### **Stasl’s Essential Psychopharmacology Neuroscientific Basis and Practical Applications, Stephen M. Staci (2021).pdf**
- **Blank Pages:** 2, 10, 640
- **Table of Contents:** 9, 25, 89, 90
- **Index Pages:** 631, 632, 633, 634, 635, 636, 637, 638, 639

#### **Understanding_adverse_effects_of_Medicines_ebook_V1.pdf**
- **Blank Pages:** 3, 5, 7, 9, 11, 19, 25, 27, 29

#### **clinical-pharmacy-and-therapeutics-by-cate-whittlesea-karen-hodson-z-lib.org_.pdf**
- **Table of Contents:** 15, 16, 71, 94, 110, 129, 137, 159
- **Index Pages:** 1071, 1073, 1081, 1083, 1107, 1108, 1109, 1110

#### **katzung 1.pdf**
- **Table of Contents:** 4, 5, 11, 41, 60, 63
- **Index Pages:** 558, 559, 560, 561, 564, 565, 566, 568, 569, 571, 572, 575, 576, 577, 578, 579, 580, 583, 586, 588, 589, 590, 591, 592, 593
- **Copyright / Front Matter:** 7

### Subject Exclusions: `PHYSIOLOGY`

#### **1669720301Guyton and Hall 2021 Textbook of Medical Physiology 14th Ed.pdf**
- **Table of Contents:** 28, 48, 107, 143
- **Index Pages:** 1024

#### **AK Jain Textbook of Physiology.pdf**
- **Blurry/Low-Visibility (OpenCV):** 6, 52, 140, 196, 198, 278, 398, 586, 1038, 1104
- **Table of Contents:** 3, 27, 99, 159, 165
- **Index Pages:** 1126, 1133, 1141, 1150, 1151, 1152, 1153, 1154, 1155, 1156

#### **Anatomy_and_Physiology_2e_-_WEB_c9nD9QL.pdf**
- **Blurry/Low-Visibility (OpenCV):** 588
- **Blank Pages:** 1, 2
- **Table of Contents:** 4, 7, 8, 9, 11, 12, 13, 14, 15, 81, 97, 98, 104, 105, 106, 114, 115, 125, 153, 154, 155, 156, 173
- **Index Pages:** 1295, 1297, 1298, 1299, 1300, 1301, 1302, 1303, 1306, 1307, 1308, 1309, 1311, 1312, 1313, 1314, 1315, 1316, 1317

#### **Berne and Levy Physiology.pdf**
- **Table of Contents:** 13, 14, 16, 22, 23, 29, 41, 105
- **Index Pages:** 844, 845, 846, 847, 848, 849, 850, 851, 852, 853, 854, 855, 856, 857, 858, 859, 860, 862, 863, 864, 865, 866, 867, 868, 869, 870, 871, 873, 874, 875, 876, 877, 878, 879, 880, 881

#### **Best and Taylor The Physiologic Basis of Medical Practice.pdf**
- **Table of Contents:** 6, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 64, 115
- **Index Pages:** 1284, 1286, 1288, 1289, 1290, 1291, 1292, 1293, 1294, 1295, 1297, 1299, 1300, 1303, 1304, 1305, 1307, 1308, 1309, 1311, 1312, 1313, 1314, 1315, 1316, 1317
- **Copyright / Front Matter:** 10

#### **Bijlani 4ed.pdf**
- **Blank Pages:** 14, 18, 24, 66, 131, 234, 286, 312, 441, 471, 503, 525, 625, 690, 710, 737, 758, 791
- **Table of Contents:** 15, 16, 17, 36, 39, 40, 63, 90, 91
- **Index Pages:** 796, 798, 820, 822, 823

#### **Boron Boulpaep Medical Physiology.pdf**
- **Blank Pages:** 2
- **Table of Contents:** 14, 18, 21, 24, 37, 50, 55, 120
- **Index Pages:** 1308, 1309, 1310, 1311, 1312, 1313, 1314, 1315, 1316, 1317, 1318, 1319, 1320, 1321, 1322, 1323, 1324, 1325, 1326, 1327, 1328, 1329, 1330, 1331, 1333, 1334, 1335, 1336, 1337, 1338, 1339, 1340, 1341, 1342, 1343, 1344, 1345, 1346, 1347, 1348, 1349, 1350, 1351
- **Copyright / Front Matter:** 10

#### **C-GUYTON &HALL.pdf**
- **Blank Pages:** 3, 11, 38, 80, 138, 194, 196, 326, 452, 454, 506, 570, 572, 588, 590, 646, 648, 708, 806, 862, 864, 938, 940, 1090
- **Table of Contents:** 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 57, 67, 76, 133
- **Index Pages:** 1104, 1105, 1106, 1107, 1108, 1109, 1110, 1111, 1112, 1113, 1114, 1115, 1116, 1117, 1118, 1119, 1120, 1121, 1122, 1123, 1124, 1125, 1126, 1127, 1128, 1129, 1130, 1131, 1132, 1133, 1134, 1135, 1136, 1137, 1138, 1139, 1140, 1141, 1142, 1143, 1144, 1145, 1146, 1147, 1148, 1149, 1150, 1151, 1152

#### **CC Chatterjee Vol.1.pdf**
- **Blank Pages:** 75, 397, 467
- **Table of Contents:** 3, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 31, 33, 57, 68, 89
- **Index Pages:** 586, 587, 588, 589, 590, 592, 593

#### **CC Chatterjee Vol.2.pdf**
- **Blank Pages:** 7, 9, 19, 125, 485, 529
- **Table of Contents:** 3, 6, 10, 11, 12, 13, 14, 15, 16, 17, 18, 26, 48, 56, 73
- **Index Pages:** 530, 531, 532, 533, 534, 535, 536, 537

#### **CL Ghai Practical Physiology.pdf**
- **Blank Pages:** 3, 7, 9, 17, 160, 276, 330, 390, 397, 398, 399, 400
- **Table of Contents:** 5, 12, 14, 16, 40, 52
- **Index Pages:** 401, 402, 403, 405

#### **Costanzo_s Physiology.pdf**
- **Table of Contents:** 17, 34, 64