/* ============================================================
   colleges.js — master college dataset (IITs, NITs, IIITs)
   ------------------------------------------------------------
   ⚠️ ILLUSTRATIVE DATA. Generated with consistent, believable
   sample values scaled by ranking. Cutoffs are JoSAA Round-1-ish
   opening/closing ranks (IIT = JEE Advanced scale, NIT/IIIT =
   JEE Main CRL scale) and are expanded into full rounds by
   utils/cutoffEngine.js (IITs: 6 JoSAA rounds; NITs/IIITs:
   6 JoSAA + 2 CSAB). Replace fees, placements and baseCutoff
   with official figures from josaa.nic.in / csab.nic.in /
   institute placement reports before publishing.
   ============================================================ */

export const BRANCHES = [
  { code: "cse", name: "Computer Science Engineering" },
  { code: "ai", name: "Artificial Intelligence & DS" },
  { code: "it", name: "Information Technology" },
  { code: "ece", name: "Electronics & Communication" },
  { code: "ee", name: "Electrical Engineering" },
  { code: "eee", name: "Electrical & Electronics" },
  { code: "me", name: "Mechanical Engineering" },
  { code: "ce", name: "Civil Engineering" },
  { code: "che", name: "Chemical Engineering" },
  { code: "chemsci", name: "Chemical Sciences" },
  { code: "mme", name: "Metallurgical & Materials" },
  { code: "maths", name: "Mathematics & Computing" },
  { code: "bio", name: "Biotechnology / Biosciences" },
  { code: "aero", name: "Aerospace Engineering" },
  { code: "arch", name: "Architecture & Planning" },
  { code: "physics", name: "Engineering Physics" },
  { code: "prod", name: "Production & Industrial" },
  { code: "mine", name: "Mining Engineering" },
  { code: "petro", name: "Petroleum Engineering" },
  { code: "instr", name: "Instrumentation Engineering" },
  { code: "ocean", name: "Ocean Engg. & Naval Arch." },
  { code: "agri", name: "Agricultural Engineering" },
  { code: "energy", name: "Energy Engineering" },
  { code: "env", name: "Environmental Engineering" },
  { code: "geology", name: "Geology / Geological Tech." },
  { code: "geophysics", name: "Geophysics" },
  { code: "econ", name: "Economics" },
  { code: "chemistry", name: "Chemistry" },
  { code: "physci", name: "Physics" },
  { code: "textile", name: "Textile Technology" },
];

export const CATEGORIES = ["OPEN", "OBC-NCL", "EWS", "SC", "ST"];

export const COLLEGES = [
  {
    "slug": "iit-madras",
    "name": "IIT Madras",
    "short": "IITM",
    "type": "IIT",
    "nirf": 1,
    "location": "Chennai, Tamil Nadu",
    "state": "Tamil Nadu",
    "coords": {
      "lat": 12.99,
      "lng": 80.23
    },
    "estd": 1959,
    "accent": "#F15A38",
    "heroImage": "/assets/team/IITs/IITs/IIT MADRAS.jpg",
    "website": "https://iitm.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Madras is an Indian Institute of Technology located in Chennai, Tamil Nadu. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 29000,
      "mess": 35000,
      "other": 14000
    },
    "placements": {
      "avg": 2440000,
      "median": 2120000,
      "highest": 34160000,
      "placedPct": 94,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 3590000,
        "ai": 3450000,
        "ece": 2360000,
        "ee": 2320000,
        "me": 2010000,
        "ce": 1490000,
        "che": 1690000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          83,
          185
        ],
        "OBC-NCL": [
          113,
          300
        ],
        "EWS": [
          97,
          232
        ],
        "SC": [
          269,
          807
        ],
        "ST": [
          222,
          1112
        ]
      },
      "ai": {
        "OPEN": [
          123,
          273
        ],
        "OBC-NCL": [
          145,
          386
        ],
        "EWS": [
          121,
          291
        ],
        "SC": [
          364,
          1093
        ],
        "ST": [
          315,
          1575
        ]
      },
      "ece": {
        "OPEN": [
          183,
          407
        ],
        "OBC-NCL": [
          243,
          649
        ],
        "EWS": [
          198,
          474
        ],
        "SC": [
          565,
          1695
        ],
        "ST": [
          502,
          2512
        ]
      },
      "ee": {
        "OPEN": [
          308,
          685
        ],
        "OBC-NCL": [
          430,
          1147
        ],
        "EWS": [
          333,
          800
        ],
        "SC": [
          1084,
          3253
        ],
        "ST": [
          903,
          4513
        ]
      },
      "me": {
        "OPEN": [
          496,
          1103
        ],
        "OBC-NCL": [
          571,
          1523
        ],
        "EWS": [
          538,
          1292
        ],
        "SC": [
          1449,
          4348
        ],
        "ST": [
          1254,
          6270
        ]
      },
      "ce": {
        "OPEN": [
          699,
          1553
        ],
        "OBC-NCL": [
          930,
          2480
        ],
        "EWS": [
          888,
          2131
        ],
        "SC": [
          2609,
          7826
        ],
        "ST": [
          2070,
          10351
        ]
      },
      "che": {
        "OPEN": [
          491,
          1092
        ],
        "OBC-NCL": [
          622,
          1659
        ],
        "EWS": [
          520,
          1249
        ],
        "SC": [
          1644,
          4932
        ],
        "ST": [
          1380,
          6902
        ]
      }
    }
  },
  {
    "slug": "iit-delhi",
    "name": "IIT Delhi",
    "short": "IITD",
    "type": "IIT",
    "nirf": 2,
    "location": "Hauz Khas, New Delhi",
    "state": "Delhi",
    "coords": {
      "lat": 28.545,
      "lng": 77.19
    },
    "estd": 1961,
    "accent": "#E0421F",
    "heroImage": "/assets/team/IITs/IITs/IIT DELHI.jpg",
    "website": "https://home.iitd.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Delhi is an Indian Institute of Technology located in Hauz Khas, New Delhi. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 29000,
      "mess": 35000,
      "other": 12000
    },
    "placements": {
      "avg": 2290000,
      "median": 1990000,
      "highest": 34350000,
      "placedPct": 94,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 3380000,
        "ai": 3330000,
        "ece": 2200000,
        "ee": 2140000,
        "me": 1740000,
        "ce": 1500000,
        "che": 1590000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          57,
          126
        ],
        "OBC-NCL": [
          71,
          189
        ],
        "EWS": [
          58,
          140
        ],
        "SC": [
          203,
          608
        ],
        "ST": [
          150,
          748
        ]
      },
      "ai": {
        "OPEN": [
          77,
          172
        ],
        "OBC-NCL": [
          104,
          277
        ],
        "EWS": [
          82,
          197
        ],
        "SC": [
          227,
          681
        ],
        "ST": [
          182,
          908
        ]
      },
      "ece": {
        "OPEN": [
          119,
          265
        ],
        "OBC-NCL": [
          165,
          441
        ],
        "EWS": [
          141,
          339
        ],
        "SC": [
          446,
          1337
        ],
        "ST": [
          359,
          1796
        ]
      },
      "ee": {
        "OPEN": [
          191,
          425
        ],
        "OBC-NCL": [
          261,
          696
        ],
        "EWS": [
          226,
          543
        ],
        "SC": [
          642,
          1927
        ],
        "ST": [
          495,
          2477
        ]
      },
      "me": {
        "OPEN": [
          358,
          796
        ],
        "OBC-NCL": [
          490,
          1307
        ],
        "EWS": [
          400,
          960
        ],
        "SC": [
          1210,
          3630
        ],
        "ST": [
          968,
          4841
        ]
      },
      "ce": {
        "OPEN": [
          677,
          1504
        ],
        "OBC-NCL": [
          868,
          2316
        ],
        "EWS": [
          770,
          1848
        ],
        "SC": [
          2199,
          6597
        ],
        "ST": [
          1847,
          9236
        ]
      },
      "che": {
        "OPEN": [
          323,
          718
        ],
        "OBC-NCL": [
          425,
          1133
        ],
        "EWS": [
          402,
          965
        ],
        "SC": [
          1166,
          3499
        ],
        "ST": [
          926,
          4628
        ]
      }
    }
  },
  {
    "slug": "iit-bombay",
    "name": "IIT Bombay",
    "short": "IITB",
    "type": "IIT",
    "nirf": 3,
    "location": "Powai, Mumbai, Maharashtra",
    "state": "Maharashtra",
    "coords": {
      "lat": 19.13,
      "lng": 72.91
    },
    "estd": 1958,
    "accent": "#d97706",
    "heroImage": "/assets/team/IITs/IITs/IIT BOMBAY.jpg",
    "website": "https://iitb.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Bombay is an Indian Institute of Technology located in Powai, Mumbai, Maharashtra. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 27000,
      "mess": 33000,
      "other": 14000
    },
    "placements": {
      "avg": 2290000,
      "median": 1990000,
      "highest": 27480000,
      "placedPct": 92,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 3480000,
        "ai": 3440000,
        "ece": 2330000,
        "ee": 1980000,
        "me": 1890000,
        "ce": 1410000,
        "che": 1650000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          31,
          68
        ],
        "OBC-NCL": [
          43,
          115
        ],
        "EWS": [
          33,
          79
        ],
        "SC": [
          103,
          309
        ],
        "ST": [
          91,
          456
        ]
      },
      "ai": {
        "OPEN": [
          50,
          112
        ],
        "OBC-NCL": [
          65,
          173
        ],
        "EWS": [
          54,
          130
        ],
        "SC": [
          156,
          469
        ],
        "ST": [
          120,
          599
        ]
      },
      "ece": {
        "OPEN": [
          71,
          158
        ],
        "OBC-NCL": [
          97,
          258
        ],
        "EWS": [
          76,
          182
        ],
        "SC": [
          247,
          742
        ],
        "ST": [
          171,
          854
        ]
      },
      "ee": {
        "OPEN": [
          125,
          278
        ],
        "OBC-NCL": [
          181,
          483
        ],
        "EWS": [
          148,
          356
        ],
        "SC": [
          451,
          1354
        ],
        "ST": [
          346,
          1730
        ]
      },
      "me": {
        "OPEN": [
          205,
          456
        ],
        "OBC-NCL": [
          255,
          680
        ],
        "EWS": [
          239,
          573
        ],
        "SC": [
          686,
          2059
        ],
        "ST": [
          526,
          2632
        ]
      },
      "ce": {
        "OPEN": [
          379,
          843
        ],
        "OBC-NCL": [
          475,
          1267
        ],
        "EWS": [
          430,
          1032
        ],
        "SC": [
          1170,
          3511
        ],
        "ST": [
          1010,
          5048
        ]
      },
      "che": {
        "OPEN": [
          212,
          471
        ],
        "OBC-NCL": [
          274,
          731
        ],
        "EWS": [
          223,
          536
        ],
        "SC": [
          666,
          1999
        ],
        "ST": [
          515,
          2574
        ]
      }
    }
  },
  {
    "slug": "iit-kanpur",
    "name": "IIT Kanpur",
    "short": "IITK",
    "type": "IIT",
    "nirf": 4,
    "location": "Kanpur, Uttar Pradesh",
    "state": "Uttar Pradesh",
    "coords": {
      "lat": 26.51,
      "lng": 80.23
    },
    "estd": 1959,
    "accent": "#c2410c",
    "heroImage": "/assets/team/IITs/IITs/IIT KANPUR.jpg",
    "website": "https://iitk.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Kanpur is an Indian Institute of Technology located in Kanpur, Uttar Pradesh. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 29000,
      "mess": 34000,
      "other": 13000
    },
    "placements": {
      "avg": 2210000,
      "median": 1920000,
      "highest": 33150000,
      "placedPct": 93,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 3310000,
        "ai": 3160000,
        "ece": 2330000,
        "ee": 2040000,
        "me": 1780000,
        "ce": 1380000,
        "che": 1580000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          105,
          233
        ],
        "OBC-NCL": [
          154,
          412
        ],
        "EWS": [
          119,
          286
        ],
        "SC": [
          395,
          1186
        ],
        "ST": [
          285,
          1427
        ]
      },
      "ai": {
        "OPEN": [
          158,
          350
        ],
        "OBC-NCL": [
          199,
          529
        ],
        "EWS": [
          169,
          406
        ],
        "SC": [
          458,
          1374
        ],
        "ST": [
          420,
          2102
        ]
      },
      "ece": {
        "OPEN": [
          242,
          538
        ],
        "OBC-NCL": [
          349,
          931
        ],
        "EWS": [
          259,
          621
        ],
        "SC": [
          807,
          2420
        ],
        "ST": [
          646,
          3228
        ]
      },
      "ee": {
        "OPEN": [
          471,
          1046
        ],
        "OBC-NCL": [
          548,
          1460
        ],
        "EWS": [
          508,
          1219
        ],
        "SC": [
          1485,
          4455
        ],
        "ST": [
          1138,
          5689
        ]
      },
      "me": {
        "OPEN": [
          768,
          1706
        ],
        "OBC-NCL": [
          1005,
          2679
        ],
        "EWS": [
          854,
          2049
        ],
        "SC": [
          2697,
          8092
        ],
        "ST": [
          1998,
          9990
        ]
      },
      "ce": {
        "OPEN": [
          1313,
          2918
        ],
        "OBC-NCL": [
          1770,
          4719
        ],
        "EWS": [
          1425,
          3420
        ],
        "SC": [
          4666,
          13997
        ],
        "ST": [
          3732,
          18660
        ]
      },
      "che": {
        "OPEN": [
          646,
          1437
        ],
        "OBC-NCL": [
          835,
          2227
        ],
        "EWS": [
          772,
          1852
        ],
        "SC": [
          2096,
          6288
        ],
        "ST": [
          1752,
          8759
        ]
      }
    }
  },
  {
    "slug": "iit-kharagpur",
    "name": "IIT Kharagpur",
    "short": "IIT KGP",
    "type": "IIT",
    "nirf": 5,
    "location": "Kharagpur, West Bengal",
    "state": "West Bengal",
    "coords": {
      "lat": 22.31,
      "lng": 87.31
    },
    "estd": 1951,
    "accent": "#0ea5a4",
    "heroImage": "/assets/team/IITs/IITs/IIT KHARAGPUR.jpg",
    "website": "https://iitkgp.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Kharagpur is an Indian Institute of Technology located in Kharagpur, West Bengal. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 27000,
      "mess": 38000,
      "other": 14000
    },
    "placements": {
      "avg": 2050000,
      "median": 1780000,
      "highest": 24600000,
      "placedPct": 95,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 3030000,
        "ai": 2860000,
        "ece": 2070000,
        "ee": 1860000,
        "me": 1620000,
        "ce": 1240000,
        "che": 1490000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          123,
          273
        ],
        "OBC-NCL": [
          162,
          433
        ],
        "EWS": [
          146,
          350
        ],
        "SC": [
          386,
          1157
        ],
        "ST": [
          327,
          1633
        ]
      },
      "ai": {
        "OPEN": [
          171,
          381
        ],
        "OBC-NCL": [
          215,
          572
        ],
        "EWS": [
          202,
          484
        ],
        "SC": [
          536,
          1609
        ],
        "ST": [
          429,
          2145
        ]
      },
      "ece": {
        "OPEN": [
          343,
          762
        ],
        "OBC-NCL": [
          443,
          1183
        ],
        "EWS": [
          382,
          918
        ],
        "SC": [
          1035,
          3104
        ],
        "ST": [
          897,
          4484
        ]
      },
      "ee": {
        "OPEN": [
          511,
          1136
        ],
        "OBC-NCL": [
          612,
          1633
        ],
        "EWS": [
          558,
          1339
        ],
        "SC": [
          1676,
          5028
        ],
        "ST": [
          1160,
          5798
        ]
      },
      "me": {
        "OPEN": [
          893,
          1984
        ],
        "OBC-NCL": [
          1200,
          3201
        ],
        "EWS": [
          921,
          2210
        ],
        "SC": [
          2677,
          8030
        ],
        "ST": [
          2141,
          10705
        ]
      },
      "ce": {
        "OPEN": [
          1176,
          2614
        ],
        "OBC-NCL": [
          1606,
          4283
        ],
        "EWS": [
          1374,
          3296
        ],
        "SC": [
          4161,
          12483
        ],
        "ST": [
          3679,
          18393
        ]
      },
      "che": {
        "OPEN": [
          901,
          2002
        ],
        "OBC-NCL": [
          1089,
          2904
        ],
        "EWS": [
          1001,
          2401
        ],
        "SC": [
          2946,
          8838
        ],
        "ST": [
          2258,
          11291
        ]
      }
    }
  },
  {
    "slug": "iit-roorkee",
    "name": "IIT Roorkee",
    "short": "IITR",
    "type": "IIT",
    "nirf": 6,
    "location": "Roorkee, Uttarakhand",
    "state": "Uttarakhand",
    "coords": {
      "lat": 29.86,
      "lng": 77.89
    },
    "estd": 1847,
    "accent": "#15803d",
    "heroImage": "/assets/team/IITs/IITs/IIT ROORKEE.jpg",
    "website": "https://iitr.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Roorkee is an Indian Institute of Technology located in Roorkee, Uttarakhand. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 31000,
      "mess": 35000,
      "other": 14000
    },
    "placements": {
      "avg": 1910000,
      "median": 1660000,
      "highest": 32470000,
      "placedPct": 93,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 2780000,
        "ai": 2670000,
        "ece": 1860000,
        "ee": 1770000,
        "me": 1520000,
        "ce": 1190000,
        "che": 1440000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          167,
          372
        ],
        "OBC-NCL": [
          217,
          578
        ],
        "EWS": [
          184,
          441
        ],
        "SC": [
          508,
          1523
        ],
        "ST": [
          442,
          2210
        ]
      },
      "ai": {
        "OPEN": [
          261,
          581
        ],
        "OBC-NCL": [
          342,
          913
        ],
        "EWS": [
          301,
          723
        ],
        "SC": [
          871,
          2614
        ],
        "ST": [
          662,
          3310
        ]
      },
      "ece": {
        "OPEN": [
          427,
          949
        ],
        "OBC-NCL": [
          537,
          1431
        ],
        "EWS": [
          510,
          1225
        ],
        "SC": [
          1514,
          4542
        ],
        "ST": [
          1162,
          5808
        ]
      },
      "ee": {
        "OPEN": [
          629,
          1398
        ],
        "OBC-NCL": [
          782,
          2086
        ],
        "EWS": [
          628,
          1507
        ],
        "SC": [
          2019,
          6058
        ],
        "ST": [
          1768,
          8842
        ]
      },
      "me": {
        "OPEN": [
          1077,
          2394
        ],
        "OBC-NCL": [
          1330,
          3545
        ],
        "EWS": [
          1152,
          2765
        ],
        "SC": [
          3292,
          9876
        ],
        "ST": [
          2899,
          14497
        ]
      },
      "ce": {
        "OPEN": [
          2095,
          4655
        ],
        "OBC-NCL": [
          2535,
          6760
        ],
        "EWS": [
          2391,
          5737
        ],
        "SC": [
          6779,
          20336
        ],
        "ST": [
          5658,
          28292
        ]
      },
      "che": {
        "OPEN": [
          1090,
          2423
        ],
        "OBC-NCL": [
          1347,
          3593
        ],
        "EWS": [
          1089,
          2613
        ],
        "SC": [
          3725,
          11176
        ],
        "ST": [
          2980,
          14899
        ]
      }
    }
  },
  {
    "slug": "iit-guwahati",
    "name": "IIT Guwahati",
    "short": "IITG",
    "type": "IIT",
    "nirf": 7,
    "location": "Guwahati, Assam",
    "state": "Assam",
    "coords": {
      "lat": 26.19,
      "lng": 91.69
    },
    "estd": 1994,
    "accent": "#9a3412",
    "heroImage": "/assets/team/IITs/IITs/IIT GUWAHATI.jpg",
    "website": "https://iitg.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Guwahati is an Indian Institute of Technology located in Guwahati, Assam. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 30000,
      "mess": 36000,
      "other": 14000
    },
    "placements": {
      "avg": 1790000,
      "median": 1560000,
      "highest": 28640000,
      "placedPct": 94,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 2790000,
        "ai": 2630000,
        "ece": 1770000,
        "ee": 1600000,
        "me": 1440000,
        "ce": 1150000,
        "che": 1340000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          213,
          472
        ],
        "OBC-NCL": [
          310,
          826
        ],
        "EWS": [
          234,
          561
        ],
        "SC": [
          780,
          2340
        ],
        "ST": [
          624,
          3120
        ]
      },
      "ai": {
        "OPEN": [
          291,
          646
        ],
        "OBC-NCL": [
          356,
          949
        ],
        "EWS": [
          354,
          850
        ],
        "SC": [
          943,
          2829
        ],
        "ST": [
          787,
          3937
        ]
      },
      "ece": {
        "OPEN": [
          542,
          1204
        ],
        "OBC-NCL": [
          651,
          1737
        ],
        "EWS": [
          627,
          1505
        ],
        "SC": [
          1787,
          5361
        ],
        "ST": [
          1370,
          6848
        ]
      },
      "ee": {
        "OPEN": [
          899,
          1997
        ],
        "OBC-NCL": [
          1208,
          3221
        ],
        "EWS": [
          947,
          2272
        ],
        "SC": [
          2939,
          8816
        ],
        "ST": [
          2534,
          12668
        ]
      },
      "me": {
        "OPEN": [
          1488,
          3307
        ],
        "OBC-NCL": [
          2007,
          5352
        ],
        "EWS": [
          1870,
          4488
        ],
        "SC": [
          4766,
          14297
        ],
        "ST": [
          3988,
          19942
        ]
      },
      "ce": {
        "OPEN": [
          2357,
          5238
        ],
        "OBC-NCL": [
          3060,
          8161
        ],
        "EWS": [
          2941,
          7058
        ],
        "SC": [
          8568,
          25704
        ],
        "ST": [
          6570,
          32849
        ]
      },
      "che": {
        "OPEN": [
          1301,
          2891
        ],
        "OBC-NCL": [
          1721,
          4590
        ],
        "EWS": [
          1569,
          3766
        ],
        "SC": [
          4461,
          13384
        ],
        "ST": [
          3238,
          16191
        ]
      }
    }
  },
  {
    "slug": "iit-hyderabad",
    "name": "IIT Hyderabad",
    "short": "IITH",
    "type": "IIT",
    "nirf": 8,
    "location": "Sangareddy, Telangana",
    "state": "Telangana",
    "coords": {
      "lat": 17.59,
      "lng": 78.12
    },
    "estd": 2008,
    "accent": "#fb923c",
    "heroImage": "/assets/team/IITs/IITs/IIT HYDERABAD.jpg",
    "website": "https://iith.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Hyderabad is an Indian Institute of Technology located in Sangareddy, Telangana. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 28000,
      "mess": 34000,
      "other": 13000
    },
    "placements": {
      "avg": 1720000,
      "median": 1500000,
      "highest": 22360000,
      "placedPct": 94,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 2550000,
        "ai": 2560000,
        "ece": 1680000,
        "ee": 1570000,
        "me": 1320000,
        "ce": 1110000,
        "che": 1250000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          328,
          730
        ],
        "OBC-NCL": [
          397,
          1058
        ],
        "EWS": [
          340,
          816
        ],
        "SC": [
          1045,
          3134
        ],
        "ST": [
          836,
          4179
        ]
      },
      "ai": {
        "OPEN": [
          399,
          887
        ],
        "OBC-NCL": [
          572,
          1525
        ],
        "EWS": [
          463,
          1111
        ],
        "SC": [
          1481,
          4442
        ],
        "ST": [
          1233,
          6164
        ]
      },
      "ece": {
        "OPEN": [
          683,
          1519
        ],
        "OBC-NCL": [
          879,
          2343
        ],
        "EWS": [
          770,
          1849
        ],
        "SC": [
          2331,
          6993
        ],
        "ST": [
          1792,
          8961
        ]
      },
      "ee": {
        "OPEN": [
          1131,
          2513
        ],
        "OBC-NCL": [
          1587,
          4231
        ],
        "EWS": [
          1457,
          3496
        ],
        "SC": [
          4394,
          13181
        ],
        "ST": [
          3481,
          17403
        ]
      },
      "me": {
        "OPEN": [
          2258,
          5019
        ],
        "OBC-NCL": [
          3138,
          8368
        ],
        "EWS": [
          2326,
          5583
        ],
        "SC": [
          6929,
          20786
        ],
        "ST": [
          5985,
          29923
        ]
      },
      "ce": {
        "OPEN": [
          3345,
          7434
        ],
        "OBC-NCL": [
          4222,
          11259
        ],
        "EWS": [
          3561,
          8546
        ],
        "SC": [
          11102,
          33306
        ],
        "ST": [
          8070,
          40349
        ]
      },
      "che": {
        "OPEN": [
          1651,
          3670
        ],
        "OBC-NCL": [
          2304,
          6144
        ],
        "EWS": [
          1866,
          4478
        ],
        "SC": [
          6059,
          18176
        ],
        "ST": [
          4425,
          22126
        ]
      }
    }
  },
  {
    "slug": "iit-bhu",
    "name": "IIT (BHU) Varanasi",
    "short": "IIT BHU",
    "type": "IIT",
    "nirf": 14,
    "location": "Varanasi, Uttar Pradesh",
    "state": "Uttar Pradesh",
    "coords": {
      "lat": 25.26,
      "lng": 82.99
    },
    "estd": 1919,
    "accent": "#f59e0b",
    "heroImage": "/assets/team/IITs/IITs/IIT BHU_VARANASI.jpg",
    "website": "https://iitbhu.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT (BHU) Varanasi is an Indian Institute of Technology located in Varanasi, Uttar Pradesh. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 29000,
      "mess": 33000,
      "other": 13000
    },
    "placements": {
      "avg": 1450000,
      "median": 1260000,
      "highest": 20300000,
      "placedPct": 92,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 2270000,
        "ai": 2050000,
        "ece": 1430000,
        "ee": 1260000,
        "me": 1150000,
        "ce": 910000,
        "che": 1100000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          466,
          1036
        ],
        "OBC-NCL": [
          638,
          1702
        ],
        "EWS": [
          483,
          1160
        ],
        "SC": [
          1451,
          4352
        ],
        "ST": [
          1224,
          6120
        ]
      },
      "ai": {
        "OPEN": [
          603,
          1340
        ],
        "OBC-NCL": [
          809,
          2156
        ],
        "EWS": [
          688,
          1650
        ],
        "SC": [
          2049,
          6147
        ],
        "ST": [
          1804,
          9018
        ]
      },
      "ece": {
        "OPEN": [
          1094,
          2431
        ],
        "OBC-NCL": [
          1469,
          3918
        ],
        "EWS": [
          1326,
          3183
        ],
        "SC": [
          4134,
          12403
        ],
        "ST": [
          3282,
          16409
        ]
      },
      "ee": {
        "OPEN": [
          2336,
          5191
        ],
        "OBC-NCL": [
          2814,
          7504
        ],
        "EWS": [
          2523,
          6056
        ],
        "SC": [
          7149,
          21448
        ],
        "ST": [
          6482,
          32412
        ]
      },
      "me": {
        "OPEN": [
          3916,
          8702
        ],
        "OBC-NCL": [
          5396,
          14389
        ],
        "EWS": [
          4342,
          10422
        ],
        "SC": [
          12593,
          37780
        ],
        "ST": [
          9545,
          47727
        ]
      },
      "ce": {
        "OPEN": [
          5364,
          11920
        ],
        "OBC-NCL": [
          7025,
          18734
        ],
        "EWS": [
          5691,
          13658
        ],
        "SC": [
          18594,
          55783
        ],
        "ST": [
          14994,
          74972
        ]
      },
      "che": {
        "OPEN": [
          2784,
          6187
        ],
        "OBC-NCL": [
          3759,
          10024
        ],
        "EWS": [
          3025,
          7260
        ],
        "SC": [
          9367,
          28100
        ],
        "ST": [
          7757,
          38784
        ]
      }
    }
  },
  {
    "slug": "iit-ism-dhanbad",
    "name": "IIT (ISM) Dhanbad",
    "short": "IIT ISM",
    "type": "IIT",
    "nirf": 15,
    "location": "Dhanbad, Jharkhand",
    "state": "Jharkhand",
    "coords": {
      "lat": 23.81,
      "lng": 86.44
    },
    "estd": 1926,
    "accent": "#0d9488",
    "heroImage": "/assets/team/IITs/IITs/IIT DHANBAD.jpeg",
    "website": "https://iitism.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT (ISM) Dhanbad is an Indian Institute of Technology located in Dhanbad, Jharkhand. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 28000,
      "mess": 34000,
      "other": 13000
    },
    "placements": {
      "avg": 1490000,
      "median": 1300000,
      "highest": 17880000,
      "placedPct": 93,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 2170000,
        "ai": 2100000,
        "ece": 1490000,
        "ee": 1390000,
        "me": 1150000,
        "ce": 960000,
        "che": 1050000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          615,
          1367
        ],
        "OBC-NCL": [
          892,
          2380
        ],
        "EWS": [
          736,
          1765
        ],
        "SC": [
          2122,
          6365
        ],
        "ST": [
          1753,
          8767
        ]
      },
      "ai": {
        "OPEN": [
          782,
          1737
        ],
        "OBC-NCL": [
          1020,
          2719
        ],
        "EWS": [
          900,
          2160
        ],
        "SC": [
          2438,
          7315
        ],
        "ST": [
          2109,
          10544
        ]
      },
      "ece": {
        "OPEN": [
          1452,
          3227
        ],
        "OBC-NCL": [
          2105,
          5612
        ],
        "EWS": [
          1656,
          3974
        ],
        "SC": [
          4928,
          14785
        ],
        "ST": [
          4354,
          21771
        ]
      },
      "ee": {
        "OPEN": [
          2336,
          5192
        ],
        "OBC-NCL": [
          3040,
          8107
        ],
        "EWS": [
          2396,
          5750
        ],
        "SC": [
          7281,
          21844
        ],
        "ST": [
          6069,
          30344
        ]
      },
      "me": {
        "OPEN": [
          4142,
          9204
        ],
        "OBC-NCL": [
          5103,
          13608
        ],
        "EWS": [
          4711,
          11307
        ],
        "SC": [
          13781,
          41344
        ],
        "ST": [
          11870,
          59348
        ]
      },
      "ce": {
        "OPEN": [
          6101,
          13559
        ],
        "OBC-NCL": [
          8853,
          23609
        ],
        "EWS": [
          6823,
          16375
        ],
        "SC": [
          20615,
          61844
        ],
        "ST": [
          16343,
          81716
        ]
      },
      "che": {
        "OPEN": [
          3760,
          8355
        ],
        "OBC-NCL": [
          4795,
          12787
        ],
        "EWS": [
          4292,
          10300
        ],
        "SC": [
          13313,
          39940
        ],
        "ST": [
          9404,
          47019
        ]
      }
    }
  },
  {
    "slug": "iit-indore",
    "name": "IIT Indore",
    "short": "IITI",
    "type": "IIT",
    "nirf": 16,
    "location": "Indore, Madhya Pradesh",
    "state": "Madhya Pradesh",
    "coords": {
      "lat": 22.52,
      "lng": 75.92
    },
    "estd": 2009,
    "accent": "#b45309",
    "heroImage": "/assets/team/IITs/IITs/IIT INDORE.webp",
    "website": "https://iiti.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Indore is an Indian Institute of Technology located in Indore, Madhya Pradesh. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 29000,
      "mess": 33000,
      "other": 14000
    },
    "placements": {
      "avg": 1370000,
      "median": 1190000,
      "highest": 19180000,
      "placedPct": 92,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 1970000,
        "ai": 2060000,
        "ece": 1350000,
        "ee": 1210000,
        "me": 1060000,
        "ce": 890000,
        "che": 1040000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          563,
          1251
        ],
        "OBC-NCL": [
          734,
          1957
        ],
        "EWS": [
          652,
          1565
        ],
        "SC": [
          2098,
          6293
        ],
        "ST": [
          1678,
          8392
        ]
      },
      "ai": {
        "OPEN": [
          796,
          1769
        ],
        "OBC-NCL": [
          1054,
          2812
        ],
        "EWS": [
          904,
          2170
        ],
        "SC": [
          2873,
          8619
        ],
        "ST": [
          2298,
          11489
        ]
      },
      "ece": {
        "OPEN": [
          1164,
          2587
        ],
        "OBC-NCL": [
          1568,
          4183
        ],
        "EWS": [
          1406,
          3374
        ],
        "SC": [
          4391,
          13172
        ],
        "ST": [
          3173,
          15866
        ]
      },
      "ee": {
        "OPEN": [
          2203,
          4895
        ],
        "OBC-NCL": [
          2923,
          7795
        ],
        "EWS": [
          2318,
          5564
        ],
        "SC": [
          6956,
          20869
        ],
        "ST": [
          5750,
          28751
        ]
      },
      "me": {
        "OPEN": [
          4156,
          9236
        ],
        "OBC-NCL": [
          4940,
          13172
        ],
        "EWS": [
          4126,
          9903
        ],
        "SC": [
          11956,
          35869
        ],
        "ST": [
          9563,
          47817
        ]
      },
      "ce": {
        "OPEN": [
          6552,
          14560
        ],
        "OBC-NCL": [
          8329,
          22210
        ],
        "EWS": [
          6148,
          14755
        ],
        "SC": [
          18605,
          55816
        ],
        "ST": [
          16522,
          82612
        ]
      },
      "che": {
        "OPEN": [
          3086,
          6858
        ],
        "OBC-NCL": [
          4645,
          12386
        ],
        "EWS": [
          3706,
          8894
        ],
        "SC": [
          9935,
          29806
        ],
        "ST": [
          9130,
          45649
        ]
      }
    }
  },
  {
    "slug": "iit-gandhinagar",
    "name": "IIT Gandhinagar",
    "short": "IITGN",
    "type": "IIT",
    "nirf": 18,
    "location": "Gandhinagar, Gujarat",
    "state": "Gujarat",
    "coords": {
      "lat": 23.21,
      "lng": 72.68
    },
    "estd": 2008,
    "accent": "#e8590c",
    "heroImage": "/assets/team/IITs/IITs/IIT GANDHINAGAR.jpg",
    "website": "https://iitgn.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Gandhinagar is an Indian Institute of Technology located in Gandhinagar, Gujarat. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 30000,
      "mess": 36000,
      "other": 13000
    },
    "placements": {
      "avg": 1280000,
      "median": 1110000,
      "highest": 20480000,
      "placedPct": 91,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 1880000,
        "ai": 1810000,
        "ece": 1310000,
        "ee": 1190000,
        "me": 1040000,
        "ce": 820000,
        "che": 980000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          705,
          1566
        ],
        "OBC-NCL": [
          1000,
          2667
        ],
        "EWS": [
          831,
          1996
        ],
        "SC": [
          2343,
          7030
        ],
        "ST": [
          1732,
          8660
        ]
      },
      "ai": {
        "OPEN": [
          870,
          1934
        ],
        "OBC-NCL": [
          1124,
          2997
        ],
        "EWS": [
          994,
          2386
        ],
        "SC": [
          2629,
          7887
        ],
        "ST": [
          2205,
          11027
        ]
      },
      "ece": {
        "OPEN": [
          1338,
          2972
        ],
        "OBC-NCL": [
          1918,
          5115
        ],
        "EWS": [
          1406,
          3374
        ],
        "SC": [
          4892,
          14677
        ],
        "ST": [
          3384,
          16921
        ]
      },
      "ee": {
        "OPEN": [
          3013,
          6696
        ],
        "OBC-NCL": [
          3626,
          9669
        ],
        "EWS": [
          3090,
          7416
        ],
        "SC": [
          9332,
          27997
        ],
        "ST": [
          7146,
          35730
        ]
      },
      "me": {
        "OPEN": [
          3885,
          8634
        ],
        "OBC-NCL": [
          5746,
          15322
        ],
        "EWS": [
          4837,
          11610
        ],
        "SC": [
          13685,
          41055
        ],
        "ST": [
          10470,
          52351
        ]
      },
      "ce": {
        "OPEN": [
          6041,
          13424
        ],
        "OBC-NCL": [
          8149,
          21732
        ],
        "EWS": [
          7576,
          18183
        ],
        "SC": [
          22457,
          67371
        ],
        "ST": [
          18692,
          93459
        ]
      },
      "che": {
        "OPEN": [
          3297,
          7328
        ],
        "OBC-NCL": [
          4302,
          11473
        ],
        "EWS": [
          4067,
          9761
        ],
        "SC": [
          12608,
          37825
        ],
        "ST": [
          9771,
          48854
        ]
      }
    }
  },
  {
    "slug": "iit-ropar",
    "name": "IIT Ropar",
    "short": "IITRPR",
    "type": "IIT",
    "nirf": 20,
    "location": "Rupnagar, Punjab",
    "state": "Punjab",
    "coords": {
      "lat": 30.97,
      "lng": 76.47
    },
    "estd": 2008,
    "accent": "#a16207",
    "heroImage": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1600&q=75",
    "website": "https://iitrpr.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Ropar is an Indian Institute of Technology located in Rupnagar, Punjab. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 30000,
      "mess": 36000,
      "other": 13000
    },
    "placements": {
      "avg": 1220000,
      "median": 1060000,
      "highest": 18300000,
      "placedPct": 90,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 1790000,
        "ai": 1780000,
        "ece": 1280000,
        "ee": 1140000,
        "me": 920000,
        "ce": 790000,
        "che": 860000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          684,
          1520
        ],
        "OBC-NCL": [
          963,
          2568
        ],
        "EWS": [
          757,
          1817
        ],
        "SC": [
          2216,
          6648
        ],
        "ST": [
          2033,
          10163
        ]
      },
      "ai": {
        "OPEN": [
          1070,
          2379
        ],
        "OBC-NCL": [
          1377,
          3672
        ],
        "EWS": [
          1261,
          3026
        ],
        "SC": [
          3308,
          9925
        ],
        "ST": [
          3025,
          15124
        ]
      },
      "ece": {
        "OPEN": [
          1965,
          4368
        ],
        "OBC-NCL": [
          2373,
          6329
        ],
        "EWS": [
          2184,
          5242
        ],
        "SC": [
          6050,
          18149
        ],
        "ST": [
          4839,
          24195
        ]
      },
      "ee": {
        "OPEN": [
          2813,
          6251
        ],
        "OBC-NCL": [
          3686,
          9830
        ],
        "EWS": [
          2911,
          6986
        ],
        "SC": [
          9294,
          27883
        ],
        "ST": [
          7374,
          36868
        ]
      },
      "me": {
        "OPEN": [
          4538,
          10084
        ],
        "OBC-NCL": [
          6076,
          16202
        ],
        "EWS": [
          5035,
          12084
        ],
        "SC": [
          15236,
          45707
        ],
        "ST": [
          12080,
          60398
        ]
      },
      "ce": {
        "OPEN": [
          7433,
          16517
        ],
        "OBC-NCL": [
          9537,
          25432
        ],
        "EWS": [
          7816,
          18758
        ],
        "SC": [
          23771,
          71314
        ],
        "ST": [
          20542,
          102708
        ]
      },
      "che": {
        "OPEN": [
          4622,
          10271
        ],
        "OBC-NCL": [
          6169,
          16451
        ],
        "EWS": [
          4794,
          11505
        ],
        "SC": [
          15110,
          45330
        ],
        "ST": [
          12090,
          60451
        ]
      }
    }
  },
  {
    "slug": "iit-patna",
    "name": "IIT Patna",
    "short": "IITP",
    "type": "IIT",
    "nirf": 22,
    "location": "Patna, Bihar",
    "state": "Bihar",
    "coords": {
      "lat": 25.53,
      "lng": 84.85
    },
    "estd": 2008,
    "accent": "#047857",
    "heroImage": "/assets/team/IITs/IITs/IIT PATNA.jpeg",
    "website": "https://iitp.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Patna is an Indian Institute of Technology located in Patna, Bihar. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 30000,
      "mess": 36000,
      "other": 14000
    },
    "placements": {
      "avg": 1170000,
      "median": 1020000,
      "highest": 17550000,
      "placedPct": 91,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 1860000,
        "ai": 1790000,
        "ece": 1200000,
        "ee": 1060000,
        "me": 960000,
        "ce": 730000,
        "che": 860000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          1023,
          2273
        ],
        "OBC-NCL": [
          1442,
          3846
        ],
        "EWS": [
          1249,
          2998
        ],
        "SC": [
          3331,
          9992
        ],
        "ST": [
          2664,
          13320
        ]
      },
      "ai": {
        "OPEN": [
          1397,
          3105
        ],
        "OBC-NCL": [
          2043,
          5448
        ],
        "EWS": [
          1650,
          3961
        ],
        "SC": [
          4318,
          12954
        ],
        "ST": [
          3614,
          18071
        ]
      },
      "ece": {
        "OPEN": [
          2133,
          4740
        ],
        "OBC-NCL": [
          3070,
          8187
        ],
        "EWS": [
          2486,
          5967
        ],
        "SC": [
          7248,
          21744
        ],
        "ST": [
          5553,
          27764
        ]
      },
      "ee": {
        "OPEN": [
          4135,
          9190
        ],
        "OBC-NCL": [
          5689,
          15171
        ],
        "EWS": [
          4498,
          10796
        ],
        "SC": [
          14283,
          42849
        ],
        "ST": [
          11904,
          59520
        ]
      },
      "me": {
        "OPEN": [
          7638,
          16973
        ],
        "OBC-NCL": [
          10464,
          27904
        ],
        "EWS": [
          8328,
          19988
        ],
        "SC": [
          26798,
          80394
        ],
        "ST": [
          19414,
          97070
        ]
      },
      "ce": {
        "OPEN": [
          10802,
          24004
        ],
        "OBC-NCL": [
          13970,
          37253
        ],
        "EWS": [
          11486,
          27565
        ],
        "SC": [
          32737,
          98212
        ],
        "ST": [
          25028,
          125142
        ]
      },
      "che": {
        "OPEN": [
          5944,
          13208
        ],
        "OBC-NCL": [
          7309,
          19490
        ],
        "EWS": [
          6355,
          15251
        ],
        "SC": [
          18528,
          55583
        ],
        "ST": [
          16177,
          80884
        ]
      }
    }
  },
  {
    "slug": "iit-mandi",
    "name": "IIT Mandi",
    "short": "IIT Mandi",
    "type": "IIT",
    "nirf": 24,
    "location": "Mandi, Himachal Pradesh",
    "state": "Himachal Pradesh",
    "coords": {
      "lat": 31.78,
      "lng": 76.99
    },
    "estd": 2009,
    "accent": "#dc6803",
    "heroImage": "/assets/team/IITs/IITs/IIT MANDI.avif",
    "website": "https://iitmandi.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Mandi is an Indian Institute of Technology located in Mandi, Himachal Pradesh. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 29000,
      "mess": 34000,
      "other": 12000
    },
    "placements": {
      "avg": 1170000,
      "median": 1020000,
      "highest": 17550000,
      "placedPct": 91,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 1730000,
        "ai": 1790000,
        "ece": 1150000,
        "ee": 1030000,
        "me": 900000,
        "ce": 730000,
        "che": 880000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          985,
          2188
        ],
        "OBC-NCL": [
          1206,
          3216
        ],
        "EWS": [
          1082,
          2598
        ],
        "SC": [
          3042,
          9126
        ],
        "ST": [
          2413,
          12064
        ]
      },
      "ai": {
        "OPEN": [
          1473,
          3273
        ],
        "OBC-NCL": [
          1919,
          5119
        ],
        "EWS": [
          1572,
          3772
        ],
        "SC": [
          5081,
          15243
        ],
        "ST": [
          3550,
          17752
        ]
      },
      "ece": {
        "OPEN": [
          2100,
          4667
        ],
        "OBC-NCL": [
          3081,
          8217
        ],
        "EWS": [
          2428,
          5827
        ],
        "SC": [
          7438,
          22314
        ],
        "ST": [
          6242,
          31209
        ]
      },
      "ee": {
        "OPEN": [
          3322,
          7383
        ],
        "OBC-NCL": [
          4710,
          12561
        ],
        "EWS": [
          3543,
          8504
        ],
        "SC": [
          10962,
          32887
        ],
        "ST": [
          9165,
          45823
        ]
      },
      "me": {
        "OPEN": [
          6450,
          14333
        ],
        "OBC-NCL": [
          9924,
          26465
        ],
        "EWS": [
          7919,
          19005
        ],
        "SC": [
          24466,
          73398
        ],
        "ST": [
          20376,
          101882
        ]
      },
      "ce": {
        "OPEN": [
          10390,
          23089
        ],
        "OBC-NCL": [
          15946,
          42523
        ],
        "EWS": [
          12888,
          30930
        ],
        "SC": [
          33806,
          101418
        ],
        "ST": [
          29794,
          148972
        ]
      },
      "che": {
        "OPEN": [
          5121,
          11380
        ],
        "OBC-NCL": [
          7234,
          19290
        ],
        "EWS": [
          5520,
          13248
        ],
        "SC": [
          18153,
          54460
        ],
        "ST": [
          13328,
          66642
        ]
      }
    }
  },
  {
    "slug": "iit-jodhpur",
    "name": "IIT Jodhpur",
    "short": "IITJ",
    "type": "IIT",
    "nirf": 26,
    "location": "Jodhpur, Rajasthan",
    "state": "Rajasthan",
    "coords": {
      "lat": 26.47,
      "lng": 73.11
    },
    "estd": 2008,
    "accent": "#ca8a04",
    "heroImage": "/assets/team/IITs/IITs/IIT JODHPUR.jpg",
    "website": "https://iitj.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Jodhpur is an Indian Institute of Technology located in Jodhpur, Rajasthan. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 30000,
      "mess": 36000,
      "other": 13000
    },
    "placements": {
      "avg": 1180000,
      "median": 1030000,
      "highest": 18880000,
      "placedPct": 90,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 1750000,
        "ai": 1690000,
        "ece": 1250000,
        "ee": 1110000,
        "me": 920000,
        "ce": 740000,
        "che": 870000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          1031,
          2291
        ],
        "OBC-NCL": [
          1532,
          4085
        ],
        "EWS": [
          1257,
          3018
        ],
        "SC": [
          3675,
          11026
        ],
        "ST": [
          2714,
          13570
        ]
      },
      "ai": {
        "OPEN": [
          1338,
          2973
        ],
        "OBC-NCL": [
          1850,
          4934
        ],
        "EWS": [
          1607,
          3857
        ],
        "SC": [
          4909,
          14727
        ],
        "ST": [
          3897,
          19485
        ]
      },
      "ece": {
        "OPEN": [
          2752,
          6115
        ],
        "OBC-NCL": [
          3295,
          8788
        ],
        "EWS": [
          2699,
          6478
        ],
        "SC": [
          8495,
          25486
        ],
        "ST": [
          7033,
          35163
        ]
      },
      "ee": {
        "OPEN": [
          3883,
          8629
        ],
        "OBC-NCL": [
          5128,
          13675
        ],
        "EWS": [
          4964,
          11914
        ],
        "SC": [
          13646,
          40938
        ],
        "ST": [
          10447,
          52234
        ]
      },
      "me": {
        "OPEN": [
          6577,
          14615
        ],
        "OBC-NCL": [
          9092,
          24245
        ],
        "EWS": [
          7811,
          18746
        ],
        "SC": [
          20848,
          62544
        ],
        "ST": [
          19066,
          95328
        ]
      },
      "ce": {
        "OPEN": [
          13430,
          29845
        ],
        "OBC-NCL": [
          18638,
          49701
        ],
        "EWS": [
          13810,
          33143
        ],
        "SC": [
          43770,
          131310
        ],
        "ST": [
          36471,
          182355
        ]
      },
      "che": {
        "OPEN": [
          6685,
          14856
        ],
        "OBC-NCL": [
          9378,
          25007
        ],
        "EWS": [
          8386,
          20127
        ],
        "SC": [
          23945,
          71834
        ],
        "ST": [
          18518,
          92590
        ]
      }
    }
  },
  {
    "slug": "iit-bhubaneswar",
    "name": "IIT Bhubaneswar",
    "short": "IITBBS",
    "type": "IIT",
    "nirf": 28,
    "location": "Bhubaneswar, Odisha",
    "state": "Odisha",
    "coords": {
      "lat": 20.14,
      "lng": 85.67
    },
    "estd": 2008,
    "accent": "#F15A38",
    "heroImage": "/assets/team/IITs/IITs/IIT BHUBANESWAR.jpg",
    "website": "https://iitbbs.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Bhubaneswar is an Indian Institute of Technology located in Bhubaneswar, Odisha. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 31000,
      "mess": 37000,
      "other": 12000
    },
    "placements": {
      "avg": 1120000,
      "median": 970000,
      "highest": 20160000,
      "placedPct": 89,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 1690000,
        "ai": 1570000,
        "ece": 1090000,
        "ee": 970000,
        "me": 870000,
        "ce": 690000,
        "che": 820000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          1220,
          2711
        ],
        "OBC-NCL": [
          1729,
          4609
        ],
        "EWS": [
          1485,
          3565
        ],
        "SC": [
          4553,
          13659
        ],
        "ST": [
          3187,
          15937
        ]
      },
      "ai": {
        "OPEN": [
          1711,
          3802
        ],
        "OBC-NCL": [
          2384,
          6358
        ],
        "EWS": [
          1863,
          4470
        ],
        "SC": [
          6307,
          18922
        ],
        "ST": [
          4427,
          22134
        ]
      },
      "ece": {
        "OPEN": [
          2977,
          6615
        ],
        "OBC-NCL": [
          3569,
          9517
        ],
        "EWS": [
          3453,
          8286
        ],
        "SC": [
          9222,
          27667
        ],
        "ST": [
          8364,
          41818
        ]
      },
      "ee": {
        "OPEN": [
          5387,
          11970
        ],
        "OBC-NCL": [
          7081,
          18884
        ],
        "EWS": [
          5605,
          13451
        ],
        "SC": [
          17334,
          52003
        ],
        "ST": [
          14569,
          72844
        ]
      },
      "me": {
        "OPEN": [
          9361,
          20803
        ],
        "OBC-NCL": [
          12963,
          34567
        ],
        "EWS": [
          10050,
          24119
        ],
        "SC": [
          30761,
          92283
        ],
        "ST": [
          22344,
          111720
        ]
      },
      "ce": {
        "OPEN": [
          13768,
          30596
        ],
        "OBC-NCL": [
          19811,
          52830
        ],
        "EWS": [
          16214,
          38913
        ],
        "SC": [
          48756,
          146267
        ],
        "ST": [
          37663,
          188314
        ]
      },
      "che": {
        "OPEN": [
          8122,
          18050
        ],
        "OBC-NCL": [
          11107,
          29618
        ],
        "EWS": [
          8799,
          21118
        ],
        "SC": [
          28061,
          84184
        ],
        "ST": [
          20343,
          101717
        ]
      }
    }
  },
  {
    "slug": "iit-tirupati",
    "name": "IIT Tirupati",
    "short": "IITTP",
    "type": "IIT",
    "nirf": 38,
    "location": "Tirupati, Andhra Pradesh",
    "state": "Andhra Pradesh",
    "coords": {
      "lat": 13.55,
      "lng": 79.39
    },
    "estd": 2015,
    "accent": "#b45309",
    "heroImage": "/assets/team/IITs/IITs/IIT TIRUPATI.jpeg",
    "website": "https://iittp.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Tirupati is an Indian Institute of Technology located in Tirupati, Andhra Pradesh. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 30000,
      "mess": 36000,
      "other": 13000
    },
    "placements": {
      "avg": 910000,
      "median": 790000,
      "highest": 13650000,
      "placedPct": 90,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 1390000,
        "ai": 1280000,
        "ece": 890000,
        "ee": 820000,
        "me": 710000,
        "ce": 570000,
        "che": 680000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          1591,
          3535
        ],
        "OBC-NCL": [
          2126,
          5669
        ],
        "EWS": [
          1965,
          4715
        ],
        "SC": [
          5062,
          15186
        ],
        "ST": [
          4459,
          22294
        ]
      },
      "ai": {
        "OPEN": [
          2231,
          4958
        ],
        "OBC-NCL": [
          2864,
          7637
        ],
        "EWS": [
          2345,
          5628
        ],
        "SC": [
          6579,
          19738
        ],
        "ST": [
          5264,
          26322
        ]
      },
      "ece": {
        "OPEN": [
          3598,
          7995
        ],
        "OBC-NCL": [
          4652,
          12405
        ],
        "EWS": [
          4291,
          10298
        ],
        "SC": [
          11608,
          34825
        ],
        "ST": [
          9366,
          46830
        ]
      },
      "ee": {
        "OPEN": [
          5898,
          13106
        ],
        "OBC-NCL": [
          7931,
          21150
        ],
        "EWS": [
          6702,
          16084
        ],
        "SC": [
          20715,
          62144
        ],
        "ST": [
          16575,
          82874
        ]
      },
      "me": {
        "OPEN": [
          10035,
          22300
        ],
        "OBC-NCL": [
          13238,
          35300
        ],
        "EWS": [
          11873,
          28496
        ],
        "SC": [
          35061,
          105182
        ],
        "ST": [
          27109,
          135547
        ]
      },
      "ce": {
        "OPEN": [
          18818,
          41818
        ],
        "OBC-NCL": [
          27250,
          72666
        ],
        "EWS": [
          21912,
          52588
        ],
        "SC": [
          69361,
          208082
        ],
        "ST": [
          50515,
          252575
        ]
      },
      "che": {
        "OPEN": [
          10583,
          23518
        ],
        "OBC-NCL": [
          13629,
          36345
        ],
        "EWS": [
          12373,
          29695
        ],
        "SC": [
          32039,
          96117
        ],
        "ST": [
          25398,
          126990
        ]
      }
    }
  },
  {
    "slug": "iit-palakkad",
    "name": "IIT Palakkad",
    "short": "IITPKD",
    "type": "IIT",
    "nirf": 44,
    "location": "Palakkad, Kerala",
    "state": "Kerala",
    "coords": {
      "lat": 10.81,
      "lng": 76.74
    },
    "estd": 2015,
    "accent": "#0ea5a4",
    "heroImage": "/assets/team/IITs/IITs/IIT PALAKKAD.jpg",
    "website": "https://iitpkd.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Palakkad is an Indian Institute of Technology located in Palakkad, Kerala. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 30000,
      "mess": 34000,
      "other": 12000
    },
    "placements": {
      "avg": 880000,
      "median": 770000,
      "highest": 14080000,
      "placedPct": 86,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 1300000,
        "ai": 1340000,
        "ece": 900000,
        "ee": 780000,
        "me": 680000,
        "ce": 550000,
        "che": 660000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          1582,
          3516
        ],
        "OBC-NCL": [
          2087,
          5565
        ],
        "EWS": [
          1835,
          4404
        ],
        "SC": [
          5629,
          16888
        ],
        "ST": [
          4352,
          21761
        ]
      },
      "ai": {
        "OPEN": [
          2483,
          5517
        ],
        "OBC-NCL": [
          3240,
          8639
        ],
        "EWS": [
          2722,
          6534
        ],
        "SC": [
          7757,
          23271
        ],
        "ST": [
          6437,
          32185
        ]
      },
      "ece": {
        "OPEN": [
          4598,
          10217
        ],
        "OBC-NCL": [
          5306,
          14150
        ],
        "EWS": [
          5174,
          12417
        ],
        "SC": [
          14466,
          43398
        ],
        "ST": [
          12055,
          60276
        ]
      },
      "ee": {
        "OPEN": [
          7642,
          16983
        ],
        "OBC-NCL": [
          10391,
          27709
        ],
        "EWS": [
          8853,
          21247
        ],
        "SC": [
          26452,
          79356
        ],
        "ST": [
          21158,
          105790
        ]
      },
      "me": {
        "OPEN": [
          11854,
          26342
        ],
        "OBC-NCL": [
          17302,
          46138
        ],
        "EWS": [
          13992,
          33580
        ],
        "SC": [
          43000,
          129000
        ],
        "ST": [
          35543,
          177717
        ]
      },
      "ce": {
        "OPEN": [
          20684,
          45964
        ],
        "OBC-NCL": [
          24286,
          64762
        ],
        "EWS": [
          19839,
          47614
        ],
        "SC": [
          63482,
          190445
        ],
        "ST": [
          48581,
          242905
        ]
      },
      "che": {
        "OPEN": [
          12738,
          28307
        ],
        "OBC-NCL": [
          16252,
          43340
        ],
        "EWS": [
          13321,
          31970
        ],
        "SC": [
          41518,
          124553
        ],
        "ST": [
          30799,
          153995
        ]
      }
    }
  },
  {
    "slug": "iit-jammu",
    "name": "IIT Jammu",
    "short": "IITJMU",
    "type": "IIT",
    "nirf": 54,
    "location": "Jagti, Jammu, Jammu & Kashmir",
    "state": "Jammu & Kashmir",
    "coords": {
      "lat": 32.62,
      "lng": 74.86
    },
    "estd": 2016,
    "accent": "#d97706",
    "heroImage": "/assets/team/IITs/IITs/IIT JAMMU.webp",
    "website": "https://iitjammu.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Jammu is an Indian Institute of Technology located in Jagti, Jammu, Jammu & Kashmir. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 33000,
      "mess": 32000,
      "other": 14000
    },
    "placements": {
      "avg": 850000,
      "median": 740000,
      "highest": 16150000,
      "placedPct": 84,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 1300000,
        "ai": 1280000,
        "ece": 820000,
        "ee": 740000,
        "me": 640000,
        "ce": 510000,
        "che": 590000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          2188,
          4861
        ],
        "OBC-NCL": [
          2699,
          7199
        ],
        "EWS": [
          2379,
          5709
        ],
        "SC": [
          7690,
          23071
        ],
        "ST": [
          5717,
          28584
        ]
      },
      "ai": {
        "OPEN": [
          3006,
          6679
        ],
        "OBC-NCL": [
          4194,
          11183
        ],
        "EWS": [
          3315,
          7956
        ],
        "SC": [
          10924,
          32772
        ],
        "ST": [
          8668,
          43340
        ]
      },
      "ece": {
        "OPEN": [
          5991,
          13313
        ],
        "OBC-NCL": [
          8311,
          22161
        ],
        "EWS": [
          7328,
          17586
        ],
        "SC": [
          23234,
          69703
        ],
        "ST": [
          17026,
          85130
        ]
      },
      "ee": {
        "OPEN": [
          9772,
          21715
        ],
        "OBC-NCL": [
          12654,
          33745
        ],
        "EWS": [
          10937,
          26248
        ],
        "SC": [
          30155,
          90465
        ],
        "ST": [
          26276,
          131380
        ]
      },
      "me": {
        "OPEN": [
          16094,
          35765
        ],
        "OBC-NCL": [
          21422,
          57126
        ],
        "EWS": [
          16112,
          38669
        ],
        "SC": [
          56438,
          169314
        ],
        "ST": [
          41196,
          205982
        ]
      },
      "ce": {
        "OPEN": [
          21984,
          48853
        ],
        "OBC-NCL": [
          30387,
          81033
        ],
        "EWS": [
          25280,
          60673
        ],
        "SC": [
          77780,
          233341
        ],
        "ST": [
          61556,
          307781
        ]
      },
      "che": {
        "OPEN": [
          13169,
          29265
        ],
        "OBC-NCL": [
          17864,
          47637
        ],
        "EWS": [
          14938,
          35851
        ],
        "SC": [
          44790,
          134369
        ],
        "ST": [
          34592,
          172960
        ]
      }
    }
  },
  {
    "slug": "iit-dharwad",
    "name": "IIT Dharwad",
    "short": "IITDH",
    "type": "IIT",
    "nirf": 58,
    "location": "Dharwad, Karnataka",
    "state": "Karnataka",
    "coords": {
      "lat": 15.39,
      "lng": 75.02
    },
    "estd": 2016,
    "accent": "#F15A38",
    "heroImage": "/assets/team/IITs/IITs/IIT DHARWAD.jpg",
    "website": "https://iitdh.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Dharwad is an Indian Institute of Technology located in Dharwad, Karnataka. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 29000,
      "mess": 33000,
      "other": 13000
    },
    "placements": {
      "avg": 860000,
      "median": 750000,
      "highest": 12040000,
      "placedPct": 86,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 1260000,
        "ai": 1290000,
        "ece": 890000,
        "ee": 750000,
        "me": 670000,
        "ce": 520000,
        "che": 620000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          1956,
          4347
        ],
        "OBC-NCL": [
          2731,
          7283
        ],
        "EWS": [
          2257,
          5417
        ],
        "SC": [
          6425,
          19274
        ],
        "ST": [
          5587,
          27937
        ]
      },
      "ai": {
        "OPEN": [
          2656,
          5902
        ],
        "OBC-NCL": [
          4116,
          10977
        ],
        "EWS": [
          3163,
          7591
        ],
        "SC": [
          10355,
          31066
        ],
        "ST": [
          7896,
          39480
        ]
      },
      "ece": {
        "OPEN": [
          5770,
          12821
        ],
        "OBC-NCL": [
          6868,
          18314
        ],
        "EWS": [
          5813,
          13951
        ],
        "SC": [
          18184,
          54553
        ],
        "ST": [
          13925,
          69626
        ]
      },
      "ee": {
        "OPEN": [
          8753,
          19452
        ],
        "OBC-NCL": [
          11280,
          30079
        ],
        "EWS": [
          10054,
          24129
        ],
        "SC": [
          29667,
          89000
        ],
        "ST": [
          21829,
          109144
        ]
      },
      "me": {
        "OPEN": [
          14098,
          31329
        ],
        "OBC-NCL": [
          19950,
          53199
        ],
        "EWS": [
          15910,
          38184
        ],
        "SC": [
          52635,
          157904
        ],
        "ST": [
          38796,
          193978
        ]
      },
      "ce": {
        "OPEN": [
          21647,
          48105
        ],
        "OBC-NCL": [
          30641,
          81709
        ],
        "EWS": [
          27313,
          65551
        ],
        "SC": [
          78770,
          236309
        ],
        "ST": [
          65639,
          328193
        ]
      },
      "che": {
        "OPEN": [
          11905,
          26455
        ],
        "OBC-NCL": [
          17246,
          45988
        ],
        "EWS": [
          13190,
          31657
        ],
        "SC": [
          42323,
          126970
        ],
        "ST": [
          33853,
          169263
        ]
      }
    }
  },
  {
    "slug": "iit-bhilai",
    "name": "IIT Bhilai",
    "short": "IIT Bhilai",
    "type": "IIT",
    "nirf": 62,
    "location": "Bhilai, Chhattisgarh",
    "state": "Chhattisgarh",
    "coords": {
      "lat": 21.2,
      "lng": 81.38
    },
    "estd": 2016,
    "accent": "#E0421F",
    "heroImage": "/assets/team/IITs/IITs/IIT BHILAI.jpg",
    "website": "https://iitbhilai.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Bhilai is an Indian Institute of Technology located in Bhilai, Chhattisgarh. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 27000,
      "mess": 38000,
      "other": 12000
    },
    "placements": {
      "avg": 810000,
      "median": 700000,
      "highest": 8910000,
      "placedPct": 84,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 1290000,
        "ai": 1150000,
        "ece": 830000,
        "ee": 740000,
        "me": 640000,
        "ce": 500000,
        "che": 570000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          2625,
          5834
        ],
        "OBC-NCL": [
          3856,
          10284
        ],
        "EWS": [
          3162,
          7589
        ],
        "SC": [
          9616,
          28847
        ],
        "ST": [
          6719,
          33597
        ]
      },
      "ai": {
        "OPEN": [
          3893,
          8650
        ],
        "OBC-NCL": [
          5342,
          14244
        ],
        "EWS": [
          4724,
          11337
        ],
        "SC": [
          14494,
          43483
        ],
        "ST": [
          10763,
          53813
        ]
      },
      "ece": {
        "OPEN": [
          6107,
          13571
        ],
        "OBC-NCL": [
          8393,
          22380
        ],
        "EWS": [
          7367,
          17681
        ],
        "SC": [
          22722,
          68165
        ],
        "ST": [
          17573,
          87865
        ]
      },
      "ee": {
        "OPEN": [
          13691,
          30425
        ],
        "OBC-NCL": [
          15999,
          42663
        ],
        "EWS": [
          15493,
          37182
        ],
        "SC": [
          45715,
          137145
        ],
        "ST": [
          35111,
          175554
        ]
      },
      "me": {
        "OPEN": [
          19278,
          42841
        ],
        "OBC-NCL": [
          26958,
          71887
        ],
        "EWS": [
          22535,
          54084
        ],
        "SC": [
          64485,
          193456
        ],
        "ST": [
          57266,
          286330
        ]
      },
      "ce": {
        "OPEN": [
          30437,
          67638
        ],
        "OBC-NCL": [
          42005,
          112014
        ],
        "EWS": [
          36512,
          87629
        ],
        "SC": [
          109398,
          328195
        ],
        "ST": [
          87503,
          437515
        ]
      },
      "che": {
        "OPEN": [
          17184,
          38186
        ],
        "OBC-NCL": [
          26566,
          70844
        ],
        "EWS": [
          19215,
          46117
        ],
        "SC": [
          67374,
          202123
        ],
        "ST": [
          47115,
          235577
        ]
      }
    }
  },
  {
    "slug": "iit-goa",
    "name": "IIT Goa",
    "short": "IIT Goa",
    "type": "IIT",
    "nirf": 66,
    "location": "Ponda, Goa",
    "state": "Goa",
    "coords": {
      "lat": 15.42,
      "lng": 74.02
    },
    "estd": 2016,
    "accent": "#d97706",
    "heroImage": "/assets/team/IITs/IITs/IIT GOA.webp",
    "website": "https://iitgoa.ac.in",
    "counsellingExam": "JEE Advanced (JoSAA)",
    "about": "IIT Goa is an Indian Institute of Technology located in Ponda, Goa. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 31000,
      "mess": 35000,
      "other": 14000
    },
    "placements": {
      "avg": 870000,
      "median": 760000,
      "highest": 14790000,
      "placedPct": 82,
      "recruiters": [
        "Google",
        "Microsoft",
        "Amazon",
        "Goldman Sachs",
        "Qualcomm",
        "Texas Instruments"
      ],
      "byBranch": {
        "cse": 1270000,
        "ai": 1310000,
        "ece": 850000,
        "ee": 770000,
        "me": 670000,
        "ce": 530000,
        "che": 620000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          1855,
          4121
        ],
        "OBC-NCL": [
          2729,
          7276
        ],
        "EWS": [
          2120,
          5088
        ],
        "SC": [
          7070,
          21211
        ],
        "ST": [
          4972,
          24858
        ]
      },
      "ai": {
        "OPEN": [
          2741,
          6092
        ],
        "OBC-NCL": [
          3653,
          9740
        ],
        "EWS": [
          2853,
          6847
        ],
        "SC": [
          9193,
          27580
        ],
        "ST": [
          6983,
          34915
        ]
      },
      "ece": {
        "OPEN": [
          4780,
          10622
        ],
        "OBC-NCL": [
          6323,
          16862
        ],
        "EWS": [
          6027,
          14464
        ],
        "SC": [
          17333,
          51998
        ],
        "ST": [
          13754,
          68771
        ]
      },
      "ee": {
        "OPEN": [
          8117,
          18037
        ],
        "OBC-NCL": [
          10744,
          28651
        ],
        "EWS": [
          7996,
          19190
        ],
        "SC": [
          23903,
          71710
        ],
        "ST": [
          21662,
          108311
        ]
      },
      "me": {
        "OPEN": [
          14822,
          32938
        ],
        "OBC-NCL": [
          18316,
          48841
        ],
        "EWS": [
          14179,
          34030
        ],
        "SC": [
          45251,
          135753
        ],
        "ST": [
          34342,
          171712
        ]
      },
      "ce": {
        "OPEN": [
          24265,
          53923
        ],
        "OBC-NCL": [
          32161,
          85762
        ],
        "EWS": [
          26108,
          62660
        ],
        "SC": [
          73622,
          220865
        ],
        "ST": [
          59401,
          297006
        ]
      },
      "che": {
        "OPEN": [
          11991,
          26646
        ],
        "OBC-NCL": [
          17742,
          47312
        ],
        "EWS": [
          14255,
          34212
        ],
        "SC": [
          43876,
          131627
        ],
        "ST": [
          30401,
          152004
        ]
      }
    }
  },
  {
    "slug": "nit-trichy",
    "name": "NIT Tiruchirappalli",
    "short": "NIT Trichy",
    "type": "NIT",
    "nirf": 9,
    "location": "Tiruchirappalli, Tamil Nadu",
    "state": "Tamil Nadu",
    "coords": {
      "lat": 10.76,
      "lng": 78.81
    },
    "estd": 1964,
    "accent": "#c2410c",
    "heroImage": "/assets/team/NITs/NIT TRICHY.jpg",
    "website": "https://nitt.edu",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Tiruchirappalli is an National Institute of Technology located in Tiruchirappalli, Tamil Nadu. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 22000,
      "mess": 34000,
      "other": 9000
    },
    "placements": {
      "avg": 1650000,
      "median": 1440000,
      "highest": 6800000,
      "placedPct": 88,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 2460000,
        "ece": 1640000,
        "ee": 1460000,
        "me": 1360000,
        "ce": 1030000,
        "che": 1220000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          2591,
          5758
        ],
        "OBC-NCL": [
          3537,
          9432
        ],
        "EWS": [
          2828,
          6786
        ],
        "SC": [
          8092,
          24277
        ],
        "ST": [
          7424,
          37122
        ]
      },
      "ece": {
        "OPEN": [
          4682,
          10404
        ],
        "OBC-NCL": [
          6707,
          17885
        ],
        "EWS": [
          5399,
          12957
        ],
        "SC": [
          17518,
          52553
        ],
        "ST": [
          14012,
          70059
        ]
      },
      "ee": {
        "OPEN": [
          9954,
          22119
        ],
        "OBC-NCL": [
          13011,
          34697
        ],
        "EWS": [
          10392,
          24941
        ],
        "SC": [
          32848,
          98544
        ],
        "ST": [
          26064,
          130319
        ]
      },
      "me": {
        "OPEN": [
          15543,
          34540
        ],
        "OBC-NCL": [
          20684,
          55157
        ],
        "EWS": [
          17407,
          41777
        ],
        "SC": [
          52191,
          156574
        ],
        "ST": [
          41375,
          206877
        ]
      },
      "ce": {
        "OPEN": [
          27884,
          61965
        ],
        "OBC-NCL": [
          36278,
          96742
        ],
        "EWS": [
          28581,
          68595
        ],
        "SC": [
          79712,
          239135
        ],
        "ST": [
          69064,
          345319
        ]
      },
      "che": {
        "OPEN": [
          14008,
          31129
        ],
        "OBC-NCL": [
          18778,
          50075
        ],
        "EWS": [
          14764,
          35434
        ],
        "SC": [
          49623,
          148870
        ],
        "ST": [
          39705,
          198527
        ]
      }
    }
  },
  {
    "slug": "nit-rourkela",
    "name": "NIT Rourkela",
    "short": "NITRKL",
    "type": "NIT",
    "nirf": 19,
    "location": "Rourkela, Odisha",
    "state": "Odisha",
    "coords": {
      "lat": 22.25,
      "lng": 84.9
    },
    "estd": 1961,
    "accent": "#0ea5a4",
    "heroImage": "/assets/team/NITs/NIT ROURKELA.avif",
    "website": "https://nitrkl.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Rourkela is an National Institute of Technology located in Rourkela, Odisha. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 22000,
      "mess": 33000,
      "other": 9000
    },
    "placements": {
      "avg": 1380000,
      "median": 1200000,
      "highest": 5280000,
      "placedPct": 87,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 2030000,
        "ece": 1460000,
        "ee": 1230000,
        "me": 1120000,
        "ce": 890000,
        "che": 1010000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          4404,
          9788
        ],
        "OBC-NCL": [
          6026,
          16069
        ],
        "EWS": [
          4662,
          11188
        ],
        "SC": [
          15190,
          45570
        ],
        "ST": [
          12255,
          61274
        ]
      },
      "ece": {
        "OPEN": [
          12269,
          27264
        ],
        "OBC-NCL": [
          15015,
          40040
        ],
        "EWS": [
          13903,
          33366
        ],
        "SC": [
          39578,
          118733
        ],
        "ST": [
          29014,
          145072
        ]
      },
      "ee": {
        "OPEN": [
          15099,
          33553
        ],
        "OBC-NCL": [
          22630,
          60348
        ],
        "EWS": [
          16586,
          39807
        ],
        "SC": [
          51703,
          155108
        ],
        "ST": [
          43567,
          217833
        ]
      },
      "me": {
        "OPEN": [
          29284,
          65076
        ],
        "OBC-NCL": [
          36557,
          97485
        ],
        "EWS": [
          31579,
          75790
        ],
        "SC": [
          95965,
          287896
        ],
        "ST": [
          69737,
          348685
        ]
      },
      "ce": {
        "OPEN": [
          50268,
          111708
        ],
        "OBC-NCL": [
          70055,
          186813
        ],
        "EWS": [
          58177,
          139624
        ],
        "SC": [
          148073,
          444220
        ],
        "ST": [
          137172,
          685860
        ]
      },
      "che": {
        "OPEN": [
          27499,
          61108
        ],
        "OBC-NCL": [
          38626,
          103002
        ],
        "EWS": [
          30360,
          72863
        ],
        "SC": [
          98299,
          294897
        ],
        "ST": [
          71022,
          355111
        ]
      }
    }
  },
  {
    "slug": "nit-surathkal",
    "name": "NIT Karnataka, Surathkal",
    "short": "NITK",
    "type": "NIT",
    "nirf": 17,
    "location": "Surathkal, Mangalore, Karnataka",
    "state": "Karnataka",
    "coords": {
      "lat": 13.01,
      "lng": 74.79
    },
    "estd": 1960,
    "accent": "#15803d",
    "heroImage": "/assets/team/NITs/NIT SURATKAL.jpg",
    "website": "https://nitk.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Karnataka, Surathkal is an National Institute of Technology located in Surathkal, Mangalore, Karnataka. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 22000,
      "mess": 33000,
      "other": 9000
    },
    "placements": {
      "avg": 1400000,
      "median": 1220000,
      "highest": 5500000,
      "placedPct": 88,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 2070000,
        "ece": 1470000,
        "ee": 1320000,
        "me": 1140000,
        "ce": 900000,
        "che": 1040000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          4284,
          9519
        ],
        "OBC-NCL": [
          5027,
          13405
        ],
        "EWS": [
          4364,
          10475
        ],
        "SC": [
          12469,
          37407
        ],
        "ST": [
          10490,
          52448
        ]
      },
      "ece": {
        "OPEN": [
          9802,
          21782
        ],
        "OBC-NCL": [
          12529,
          33411
        ],
        "EWS": [
          11030,
          26472
        ],
        "SC": [
          33508,
          100524
        ],
        "ST": [
          24459,
          122295
        ]
      },
      "ee": {
        "OPEN": [
          15961,
          35469
        ],
        "OBC-NCL": [
          21436,
          57163
        ],
        "EWS": [
          19751,
          47402
        ],
        "SC": [
          55060,
          165179
        ],
        "ST": [
          42097,
          210486
        ]
      },
      "me": {
        "OPEN": [
          26876,
          59725
        ],
        "OBC-NCL": [
          35236,
          93963
        ],
        "EWS": [
          29705,
          71291
        ],
        "SC": [
          80511,
          241534
        ],
        "ST": [
          73711,
          368557
        ]
      },
      "ce": {
        "OPEN": [
          48664,
          108142
        ],
        "OBC-NCL": [
          60091,
          160243
        ],
        "EWS": [
          54348,
          130436
        ],
        "SC": [
          175002,
          525007
        ],
        "ST": [
          126903,
          634517
        ]
      },
      "che": {
        "OPEN": [
          24433,
          54296
        ],
        "OBC-NCL": [
          35416,
          94442
        ],
        "EWS": [
          27556,
          66134
        ],
        "SC": [
          87815,
          263445
        ],
        "ST": [
          67945,
          339726
        ]
      }
    }
  },
  {
    "slug": "nit-warangal",
    "name": "NIT Warangal",
    "short": "NITW",
    "type": "NIT",
    "nirf": 21,
    "location": "Warangal, Telangana",
    "state": "Telangana",
    "coords": {
      "lat": 17.98,
      "lng": 79.53
    },
    "estd": 1959,
    "accent": "#9a3412",
    "heroImage": "/assets/team/NITs/NIT WARANGAL.jpg",
    "website": "https://nitw.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Warangal is an National Institute of Technology located in Warangal, Telangana. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 23000,
      "mess": 35000,
      "other": 8000
    },
    "placements": {
      "avg": 1230000,
      "median": 1070000,
      "highest": 5220000,
      "placedPct": 87,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 1940000,
        "ece": 1230000,
        "ee": 1170000,
        "me": 980000,
        "ce": 780000,
        "che": 930000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          4929,
          10954
        ],
        "OBC-NCL": [
          7319,
          19517
        ],
        "EWS": [
          5537,
          13290
        ],
        "SC": [
          18418,
          55254
        ],
        "ST": [
          14732,
          73660
        ]
      },
      "ece": {
        "OPEN": [
          11936,
          26524
        ],
        "OBC-NCL": [
          15433,
          41154
        ],
        "EWS": [
          13118,
          31482
        ],
        "SC": [
          42268,
          126805
        ],
        "ST": [
          32422,
          162112
        ]
      },
      "ee": {
        "OPEN": [
          20647,
          45882
        ],
        "OBC-NCL": [
          25841,
          68909
        ],
        "EWS": [
          20678,
          49628
        ],
        "SC": [
          61773,
          185319
        ],
        "ST": [
          53333,
          266667
        ]
      },
      "me": {
        "OPEN": [
          32540,
          72311
        ],
        "OBC-NCL": [
          42926,
          114470
        ],
        "EWS": [
          34125,
          81899
        ],
        "SC": [
          113984,
          341953
        ],
        "ST": [
          94951,
          474753
        ]
      },
      "ce": {
        "OPEN": [
          51597,
          114660
        ],
        "OBC-NCL": [
          74487,
          198632
        ],
        "EWS": [
          64146,
          153951
        ],
        "SC": [
          170905,
          512714
        ],
        "ST": [
          130624,
          653120
        ]
      },
      "che": {
        "OPEN": [
          28572,
          63494
        ],
        "OBC-NCL": [
          38552,
          102804
        ],
        "EWS": [
          32806,
          78733
        ],
        "SC": [
          105483,
          316448
        ],
        "ST": [
          76707,
          383535
        ]
      }
    }
  },
  {
    "slug": "nit-calicut",
    "name": "NIT Calicut",
    "short": "NITC",
    "type": "NIT",
    "nirf": 23,
    "location": "Kozhikode, Kerala",
    "state": "Kerala",
    "coords": {
      "lat": 11.32,
      "lng": 75.93
    },
    "estd": 1961,
    "accent": "#fb923c",
    "heroImage": "/assets/team/NITs/NIT CALICUT.jpg",
    "website": "https://nitc.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Calicut is an National Institute of Technology located in Kozhikode, Kerala. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 21000,
      "mess": 32000,
      "other": 9000
    },
    "placements": {
      "avg": 1160000,
      "median": 1010000,
      "highest": 4030000,
      "placedPct": 88,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 1690000,
        "ece": 1140000,
        "ee": 1080000,
        "me": 920000,
        "ce": 740000,
        "che": 880000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          4667,
          10371
        ],
        "OBC-NCL": [
          5805,
          15480
        ],
        "EWS": [
          5377,
          12904
        ],
        "SC": [
          14265,
          42796
        ],
        "ST": [
          11410,
          57050
        ]
      },
      "ece": {
        "OPEN": [
          12829,
          28510
        ],
        "OBC-NCL": [
          15739,
          41972
        ],
        "EWS": [
          13461,
          32307
        ],
        "SC": [
          44110,
          132330
        ],
        "ST": [
          33855,
          169275
        ]
      },
      "ee": {
        "OPEN": [
          21443,
          47651
        ],
        "OBC-NCL": [
          28458,
          75887
        ],
        "EWS": [
          25212,
          60509
        ],
        "SC": [
          66025,
          198075
        ],
        "ST": [
          57212,
          286061
        ]
      },
      "me": {
        "OPEN": [
          36968,
          82152
        ],
        "OBC-NCL": [
          45647,
          121724
        ],
        "EWS": [
          41169,
          98805
        ],
        "SC": [
          127463,
          382390
        ],
        "ST": [
          88914,
          444572
        ]
      },
      "ce": {
        "OPEN": [
          53056,
          117903
        ],
        "OBC-NCL": [
          76656,
          204417
        ],
        "EWS": [
          69141,
          165939
        ],
        "SC": [
          187514,
          562543
        ],
        "ST": [
          143437,
          717183
        ]
      },
      "che": {
        "OPEN": [
          33128,
          73618
        ],
        "OBC-NCL": [
          46031,
          122749
        ],
        "EWS": [
          35549,
          85316
        ],
        "SC": [
          117019,
          351056
        ],
        "ST": [
          85155,
          425773
        ]
      }
    }
  },
  {
    "slug": "nit-nagpur",
    "name": "VNIT Nagpur",
    "short": "VNIT",
    "type": "NIT",
    "nirf": 27,
    "location": "Nagpur, Maharashtra",
    "state": "Maharashtra",
    "coords": {
      "lat": 21.12,
      "lng": 79.05
    },
    "estd": 1960,
    "accent": "#f59e0b",
    "heroImage": "/assets/team/NITs/NIT NAGPUR.avif",
    "website": "https://vnit.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "VNIT Nagpur is an National Institute of Technology located in Nagpur, Maharashtra. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 21000,
      "mess": 32000,
      "other": 8000
    },
    "placements": {
      "avg": 1080000,
      "median": 940000,
      "highest": 3750000,
      "placedPct": 87,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 1690000,
        "ece": 1110000,
        "ee": 970000,
        "me": 830000,
        "ce": 650000,
        "che": 780000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          5352,
          11894
        ],
        "OBC-NCL": [
          7869,
          20985
        ],
        "EWS": [
          6577,
          15784
        ],
        "SC": [
          19324,
          57973
        ],
        "ST": [
          16058,
          80289
        ]
      },
      "ece": {
        "OPEN": [
          14028,
          31174
        ],
        "OBC-NCL": [
          15899,
          42399
        ],
        "EWS": [
          14487,
          34769
        ],
        "SC": [
          39917,
          119751
        ],
        "ST": [
          32221,
          161107
        ]
      },
      "ee": {
        "OPEN": [
          25173,
          55940
        ],
        "OBC-NCL": [
          35617,
          94980
        ],
        "EWS": [
          30434,
          73042
        ],
        "SC": [
          85600,
          256801
        ],
        "ST": [
          66132,
          330658
        ]
      },
      "me": {
        "OPEN": [
          35250,
          78334
        ],
        "OBC-NCL": [
          50856,
          135617
        ],
        "EWS": [
          40994,
          98385
        ],
        "SC": [
          120451,
          361352
        ],
        "ST": [
          96378,
          481890
        ]
      },
      "ce": {
        "OPEN": [
          74085,
          164634
        ],
        "OBC-NCL": [
          96144,
          256383
        ],
        "EWS": [
          79564,
          190953
        ],
        "SC": [
          229943,
          689828
        ],
        "ST": [
          193231,
          966157
        ]
      },
      "che": {
        "OPEN": [
          34062,
          75694
        ],
        "OBC-NCL": [
          46736,
          124630
        ],
        "EWS": [
          34089,
          81815
        ],
        "SC": [
          104435,
          313306
        ],
        "ST": [
          82801,
          414003
        ]
      }
    }
  },
  {
    "slug": "mnit-jaipur",
    "name": "MNIT Jaipur",
    "short": "MNIT",
    "type": "NIT",
    "nirf": 35,
    "location": "Jaipur, Rajasthan",
    "state": "Rajasthan",
    "coords": {
      "lat": 26.86,
      "lng": 75.81
    },
    "estd": 1963,
    "accent": "#0d9488",
    "heroImage": "/assets/team/NITs/NIT JAIPUR.jpeg",
    "website": "https://mnit.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "MNIT Jaipur is an National Institute of Technology located in Jaipur, Rajasthan. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 22000,
      "mess": 33000,
      "other": 9000
    },
    "placements": {
      "avg": 930000,
      "median": 810000,
      "highest": 3890000,
      "placedPct": 84,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 1410000,
        "ece": 900000,
        "ee": 830000,
        "me": 730000,
        "ce": 560000,
        "che": 690000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          7501,
          16669
        ],
        "OBC-NCL": [
          8796,
          23455
        ],
        "EWS": [
          7540,
          18095
        ],
        "SC": [
          22590,
          67770
        ],
        "ST": [
          19665,
          98325
        ]
      },
      "ece": {
        "OPEN": [
          18539,
          41198
        ],
        "OBC-NCL": [
          23968,
          63915
        ],
        "EWS": [
          23475,
          56341
        ],
        "SC": [
          65109,
          195328
        ],
        "ST": [
          49873,
          249364
        ]
      },
      "ee": {
        "OPEN": [
          32005,
          71122
        ],
        "OBC-NCL": [
          43477,
          115938
        ],
        "EWS": [
          39184,
          94041
        ],
        "SC": [
          119259,
          357777
        ],
        "ST": [
          87741,
          438704
        ]
      },
      "me": {
        "OPEN": [
          44800,
          99556
        ],
        "OBC-NCL": [
          64470,
          171920
        ],
        "EWS": [
          51300,
          123119
        ],
        "SC": [
          146070,
          438210
        ],
        "ST": [
          128431,
          642154
        ]
      },
      "ce": {
        "OPEN": [
          83861,
          186358
        ],
        "OBC-NCL": [
          108959,
          290558
        ],
        "EWS": [
          87337,
          209608
        ],
        "SC": [
          241553,
          724658
        ],
        "ST": [
          201992,
          1009962
        ]
      },
      "che": {
        "OPEN": [
          43050,
          95666
        ],
        "OBC-NCL": [
          61291,
          163441
        ],
        "EWS": [
          52444,
          125865
        ],
        "SC": [
          152128,
          456384
        ],
        "ST": [
          121682,
          608408
        ]
      }
    }
  },
  {
    "slug": "mnnit-allahabad",
    "name": "MNNIT Allahabad",
    "short": "MNNIT",
    "type": "NIT",
    "nirf": 39,
    "location": "Prayagraj, Uttar Pradesh",
    "state": "Uttar Pradesh",
    "coords": {
      "lat": 25.49,
      "lng": 81.86
    },
    "estd": 1961,
    "accent": "#b45309",
    "heroImage": "/assets/team/NITs/NIT ALLAHABAD.jpeg",
    "website": "https://mnnit.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "MNNIT Allahabad is an National Institute of Technology located in Prayagraj, Uttar Pradesh. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 23000,
      "mess": 35000,
      "other": 8000
    },
    "placements": {
      "avg": 870000,
      "median": 760000,
      "highest": 3790000,
      "placedPct": 83,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 1350000,
        "ece": 870000,
        "ee": 800000,
        "me": 720000,
        "ce": 570000,
        "che": 610000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          8040,
          17866
        ],
        "OBC-NCL": [
          11029,
          29410
        ],
        "EWS": [
          9645,
          23148
        ],
        "SC": [
          27937,
          83812
        ],
        "ST": [
          23348,
          116741
        ]
      },
      "ece": {
        "OPEN": [
          20757,
          46126
        ],
        "OBC-NCL": [
          27348,
          72927
        ],
        "EWS": [
          22440,
          53857
        ],
        "SC": [
          67574,
          202721
        ],
        "ST": [
          51312,
          256559
        ]
      },
      "ee": {
        "OPEN": [
          31816,
          70702
        ],
        "OBC-NCL": [
          41779,
          111410
        ],
        "EWS": [
          37369,
          89686
        ],
        "SC": [
          102253,
          306759
        ],
        "ST": [
          86269,
          431346
        ]
      },
      "me": {
        "OPEN": [
          58327,
          129615
        ],
        "OBC-NCL": [
          80832,
          215552
        ],
        "EWS": [
          66980,
          160753
        ],
        "SC": [
          181662,
          544985
        ],
        "ST": [
          158491,
          792453
        ]
      },
      "ce": {
        "OPEN": [
          97654,
          217008
        ],
        "OBC-NCL": [
          123698,
          329862
        ],
        "EWS": [
          108373,
          260096
        ],
        "SC": [
          288155,
          864464
        ],
        "ST": [
          266827,
          1334135
        ]
      },
      "che": {
        "OPEN": [
          56600,
          125779
        ],
        "OBC-NCL": [
          71112,
          189633
        ],
        "EWS": [
          60108,
          144260
        ],
        "SC": [
          172111,
          516334
        ],
        "ST": [
          148744,
          743721
        ]
      }
    }
  },
  {
    "slug": "nit-kurukshetra",
    "name": "NIT Kurukshetra",
    "short": "NITKKR",
    "type": "NIT",
    "nirf": 41,
    "location": "Kurukshetra, Haryana",
    "state": "Haryana",
    "coords": {
      "lat": 29.95,
      "lng": 76.82
    },
    "estd": 1963,
    "accent": "#e8590c",
    "heroImage": "/assets/team/NITs/NIT KRUKSHETRA.jpg",
    "website": "https://nitkkr.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Kurukshetra is an National Institute of Technology located in Kurukshetra, Haryana. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 21000,
      "mess": 32000,
      "other": 9000
    },
    "placements": {
      "avg": 830000,
      "median": 720000,
      "highest": 2950000,
      "placedPct": 85,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 1250000,
        "ece": 810000,
        "ee": 730000,
        "me": 650000,
        "ce": 500000,
        "che": 580000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          7392,
          16426
        ],
        "OBC-NCL": [
          11030,
          29412
        ],
        "EWS": [
          8065,
          19356
        ],
        "SC": [
          27228,
          81684
        ],
        "ST": [
          21779,
          108893
        ]
      },
      "ece": {
        "OPEN": [
          19795,
          43988
        ],
        "OBC-NCL": [
          30130,
          80347
        ],
        "EWS": [
          21682,
          52036
        ],
        "SC": [
          75800,
          227400
        ],
        "ST": [
          58272,
          291358
        ]
      },
      "ee": {
        "OPEN": [
          34679,
          77064
        ],
        "OBC-NCL": [
          46616,
          124311
        ],
        "EWS": [
          39936,
          95847
        ],
        "SC": [
          108814,
          326443
        ],
        "ST": [
          90948,
          454739
        ]
      },
      "me": {
        "OPEN": [
          56360,
          125244
        ],
        "OBC-NCL": [
          85768,
          228713
        ],
        "EWS": [
          73680,
          176831
        ],
        "SC": [
          205158,
          615473
        ],
        "ST": [
          176542,
          882709
        ]
      },
      "ce": {
        "OPEN": [
          101363,
          225252
        ],
        "OBC-NCL": [
          145159,
          387090
        ],
        "EWS": [
          107786,
          258686
        ],
        "SC": [
          377983,
          1133949
        ],
        "ST": [
          290367,
          1451837
        ]
      },
      "che": {
        "OPEN": [
          54851,
          121890
        ],
        "OBC-NCL": [
          71474,
          190596
        ],
        "EWS": [
          65993,
          158382
        ],
        "SC": [
          193656,
          580968
        ],
        "ST": [
          140688,
          703438
        ]
      }
    }
  },
  {
    "slug": "svnit-surat",
    "name": "SVNIT Surat",
    "short": "SVNIT",
    "type": "NIT",
    "nirf": 43,
    "location": "Surat, Gujarat",
    "state": "Gujarat",
    "coords": {
      "lat": 21.16,
      "lng": 72.78
    },
    "estd": 1961,
    "accent": "#a16207",
    "heroImage": "/assets/team/NITs/NIT SURAT.JPG",
    "website": "https://svnit.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "SVNIT Surat is an National Institute of Technology located in Surat, Gujarat. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 21000,
      "mess": 31000,
      "other": 9000
    },
    "placements": {
      "avg": 840000,
      "median": 730000,
      "highest": 3130000,
      "placedPct": 84,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 1260000,
        "ece": 850000,
        "ee": 740000,
        "me": 680000,
        "ce": 550000,
        "che": 580000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          8354,
          18565
        ],
        "OBC-NCL": [
          12550,
          33466
        ],
        "EWS": [
          9513,
          22831
        ],
        "SC": [
          29502,
          88505
        ],
        "ST": [
          25387,
          126933
        ]
      },
      "ece": {
        "OPEN": [
          25124,
          55830
        ],
        "OBC-NCL": [
          30330,
          80880
        ],
        "EWS": [
          23955,
          57492
        ],
        "SC": [
          75381,
          226142
        ],
        "ST": [
          60316,
          301578
        ]
      },
      "ee": {
        "OPEN": [
          36395,
          80879
        ],
        "OBC-NCL": [
          50589,
          134904
        ],
        "EWS": [
          43040,
          103296
        ],
        "SC": [
          140483,
          421448
        ],
        "ST": [
          107944,
          539720
        ]
      },
      "me": {
        "OPEN": [
          72731,
          161624
        ],
        "OBC-NCL": [
          88554,
          236143
        ],
        "EWS": [
          74494,
          178785
        ],
        "SC": [
          238413,
          715240
        ],
        "ST": [
          176046,
          880231
        ]
      },
      "ce": {
        "OPEN": [
          94189,
          209309
        ],
        "OBC-NCL": [
          119431,
          318483
        ],
        "EWS": [
          111065,
          266557
        ],
        "SC": [
          287317,
          861952
        ],
        "ST": [
          229809,
          1149046
        ]
      },
      "che": {
        "OPEN": [
          63734,
          141630
        ],
        "OBC-NCL": [
          83085,
          221559
        ],
        "EWS": [
          68436,
          164247
        ],
        "SC": [
          203623,
          610870
        ],
        "ST": [
          149558,
          747792
        ]
      }
    }
  },
  {
    "slug": "nit-durgapur",
    "name": "NIT Durgapur",
    "short": "NITDGP",
    "type": "NIT",
    "nirf": 46,
    "location": "Durgapur, West Bengal",
    "state": "West Bengal",
    "coords": {
      "lat": 23.55,
      "lng": 87.29
    },
    "estd": 1960,
    "accent": "#047857",
    "heroImage": "/assets/team/NITs/NIT DURGAPUR.jpg",
    "website": "https://nitdgp.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Durgapur is an National Institute of Technology located in Durgapur, West Bengal. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 24000,
      "mess": 36000,
      "other": 8000
    },
    "placements": {
      "avg": 820000,
      "median": 710000,
      "highest": 3930000,
      "placedPct": 82,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 1240000,
        "ece": 870000,
        "ee": 780000,
        "me": 670000,
        "ce": 510000,
        "che": 610000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          11414,
          25364
        ],
        "OBC-NCL": [
          13352,
          35604
        ],
        "EWS": [
          11107,
          26658
        ],
        "SC": [
          35431,
          106293
        ],
        "ST": [
          28049,
          140247
        ]
      },
      "ece": {
        "OPEN": [
          21426,
          47613
        ],
        "OBC-NCL": [
          26179,
          69809
        ],
        "EWS": [
          22231,
          53355
        ],
        "SC": [
          76537,
          229610
        ],
        "ST": [
          59304,
          296518
        ]
      },
      "ee": {
        "OPEN": [
          34248,
          76108
        ],
        "OBC-NCL": [
          43426,
          115802
        ],
        "EWS": [
          39425,
          94621
        ],
        "SC": [
          107353,
          322058
        ],
        "ST": [
          98631,
          493153
        ]
      },
      "me": {
        "OPEN": [
          63188,
          140417
        ],
        "OBC-NCL": [
          82389,
          219703
        ],
        "EWS": [
          71773,
          172255
        ],
        "SC": [
          216482,
          649447
        ],
        "ST": [
          191512,
          957560
        ]
      },
      "ce": {
        "OPEN": [
          104823,
          232939
        ],
        "OBC-NCL": [
          133541,
          356108
        ],
        "EWS": [
          109860,
          263664
        ],
        "SC": [
          358208,
          1074623
        ],
        "ST": [
          286515,
          1432575
        ]
      },
      "che": {
        "OPEN": [
          59186,
          131525
        ],
        "OBC-NCL": [
          74601,
          198935
        ],
        "EWS": [
          65046,
          156109
        ],
        "SC": [
          193806,
          581417
        ],
        "ST": [
          161571,
          807853
        ]
      }
    }
  },
  {
    "slug": "manit-bhopal",
    "name": "MANIT Bhopal",
    "short": "MANIT",
    "type": "NIT",
    "nirf": 49,
    "location": "Bhopal, Madhya Pradesh",
    "state": "Madhya Pradesh",
    "coords": {
      "lat": 23.21,
      "lng": 77.41
    },
    "estd": 1960,
    "accent": "#dc6803",
    "heroImage": "/assets/team/NITs/NIT BHOPAL.jpeg",
    "website": "https://manit.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "MANIT Bhopal is an National Institute of Technology located in Bhopal, Madhya Pradesh. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 21000,
      "mess": 32000,
      "other": 9000
    },
    "placements": {
      "avg": 790000,
      "median": 690000,
      "highest": 3010000,
      "placedPct": 83,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 1210000,
        "ece": 820000,
        "ee": 730000,
        "me": 600000,
        "ce": 510000,
        "che": 560000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          9601,
          21337
        ],
        "OBC-NCL": [
          12226,
          32602
        ],
        "EWS": [
          10171,
          24410
        ],
        "SC": [
          33238,
          99715
        ],
        "ST": [
          23958,
          119789
        ]
      },
      "ece": {
        "OPEN": [
          26355,
          58566
        ],
        "OBC-NCL": [
          31152,
          83072
        ],
        "EWS": [
          28618,
          68682
        ],
        "SC": [
          76697,
          230090
        ],
        "ST": [
          61369,
          306845
        ]
      },
      "ee": {
        "OPEN": [
          37281,
          82846
        ],
        "OBC-NCL": [
          50025,
          133399
        ],
        "EWS": [
          44631,
          107115
        ],
        "SC": [
          121494,
          364481
        ],
        "ST": [
          107256,
          536281
        ]
      },
      "me": {
        "OPEN": [
          72745,
          161655
        ],
        "OBC-NCL": [
          111069,
          296185
        ],
        "EWS": [
          84168,
          202003
        ],
        "SC": [
          265535,
          796606
        ],
        "ST": [
          203508,
          1017541
        ]
      },
      "ce": {
        "OPEN": [
          119438,
          265417
        ],
        "OBC-NCL": [
          160479,
          427944
        ],
        "EWS": [
          121192,
          290862
        ],
        "SC": [
          360297,
          1080890
        ],
        "ST": [
          298902,
          1494510
        ]
      },
      "che": {
        "OPEN": [
          67416,
          149812
        ],
        "OBC-NCL": [
          88663,
          236435
        ],
        "EWS": [
          75993,
          182384
        ],
        "SC": [
          221255,
          663765
        ],
        "ST": [
          178518,
          892591
        ]
      }
    }
  },
  {
    "slug": "nit-silchar",
    "name": "NIT Silchar",
    "short": "NITS",
    "type": "NIT",
    "nirf": 51,
    "location": "Silchar, Assam",
    "state": "Assam",
    "coords": {
      "lat": 24.76,
      "lng": 92.79
    },
    "estd": 1967,
    "accent": "#ca8a04",
    "heroImage": "/assets/team/NITs/NIT SILCHAR.jpg",
    "website": "https://nits.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Silchar is an National Institute of Technology located in Silchar, Assam. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 22000,
      "mess": 33000,
      "other": 9000
    },
    "placements": {
      "avg": 750000,
      "median": 650000,
      "highest": 3030000,
      "placedPct": 82,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 1130000,
        "ece": 770000,
        "ee": 710000,
        "me": 610000,
        "ce": 480000,
        "che": 550000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          12396,
          27546
        ],
        "OBC-NCL": [
          15109,
          40290
        ],
        "EWS": [
          14146,
          33950
        ],
        "SC": [
          40165,
          120495
        ],
        "ST": [
          33483,
          167413
        ]
      },
      "ece": {
        "OPEN": [
          25075,
          55722
        ],
        "OBC-NCL": [
          32549,
          86799
        ],
        "EWS": [
          27368,
          65684
        ],
        "SC": [
          86882,
          260645
        ],
        "ST": [
          67314,
          336568
        ]
      },
      "ee": {
        "OPEN": [
          50765,
          112811
        ],
        "OBC-NCL": [
          65683,
          175155
        ],
        "EWS": [
          50442,
          121061
        ],
        "SC": [
          148572,
          445716
        ],
        "ST": [
          131567,
          657833
        ]
      },
      "me": {
        "OPEN": [
          65992,
          146648
        ],
        "OBC-NCL": [
          99083,
          264221
        ],
        "EWS": [
          79372,
          190493
        ],
        "SC": [
          252606,
          757818
        ],
        "ST": [
          194213,
          971064
        ]
      },
      "ce": {
        "OPEN": [
          123972,
          275494
        ],
        "OBC-NCL": [
          153337,
          408900
        ],
        "EWS": [
          137574,
          330178
        ],
        "SC": [
          396812,
          1190436
        ],
        "ST": [
          328757,
          1643786
        ]
      },
      "che": {
        "OPEN": [
          72882,
          161960
        ],
        "OBC-NCL": [
          96972,
          258592
        ],
        "EWS": [
          74307,
          178338
        ],
        "SC": [
          258666,
          775997
        ],
        "ST": [
          174530,
          872649
        ]
      }
    }
  },
  {
    "slug": "nit-jalandhar",
    "name": "Dr B R Ambedkar NIT Jalandhar",
    "short": "NITJ",
    "type": "NIT",
    "nirf": 53,
    "location": "Jalandhar, Punjab",
    "state": "Punjab",
    "coords": {
      "lat": 31.4,
      "lng": 75.54
    },
    "estd": 1987,
    "accent": "#F15A38",
    "heroImage": "/assets/team/NITs/NIT JHALANDAR.jpg",
    "website": "https://nitj.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "Dr B R Ambedkar NIT Jalandhar is an National Institute of Technology located in Jalandhar, Punjab. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 20000,
      "mess": 31000,
      "other": 8000
    },
    "placements": {
      "avg": 770000,
      "median": 670000,
      "highest": 2650000,
      "placedPct": 83,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 1180000,
        "ece": 790000,
        "ee": 710000,
        "me": 600000,
        "ce": 500000,
        "che": 590000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          12611,
          28025
        ],
        "OBC-NCL": [
          17133,
          45687
        ],
        "EWS": [
          13456,
          32294
        ],
        "SC": [
          40286,
          120858
        ],
        "ST": [
          30834,
          154170
        ]
      },
      "ece": {
        "OPEN": [
          24655,
          54790
        ],
        "OBC-NCL": [
          35090,
          93574
        ],
        "EWS": [
          27732,
          66557
        ],
        "SC": [
          93672,
          281015
        ],
        "ST": [
          74925,
          374624
        ]
      },
      "ee": {
        "OPEN": [
          51245,
          113877
        ],
        "OBC-NCL": [
          70077,
          186871
        ],
        "EWS": [
          55859,
          134062
        ],
        "SC": [
          158854,
          476563
        ],
        "ST": [
          125987,
          629933
        ]
      },
      "me": {
        "OPEN": [
          80055,
          177900
        ],
        "OBC-NCL": [
          111955,
          298547
        ],
        "EWS": [
          93758,
          225019
        ],
        "SC": [
          302060,
          906181
        ],
        "ST": [
          239718,
          1198592
        ]
      },
      "ce": {
        "OPEN": [
          127028,
          282284
        ],
        "OBC-NCL": [
          163747,
          436658
        ],
        "EWS": [
          153700,
          368880
        ],
        "SC": [
          439064,
          1317191
        ],
        "ST": [
          378357,
          1891787
        ]
      },
      "che": {
        "OPEN": [
          68145,
          151434
        ],
        "OBC-NCL": [
          90956,
          242548
        ],
        "EWS": [
          74149,
          177959
        ],
        "SC": [
          205887,
          617662
        ],
        "ST": [
          164742,
          823708
        ]
      }
    }
  },
  {
    "slug": "nit-jamshedpur",
    "name": "NIT Jamshedpur",
    "short": "NITJSR",
    "type": "NIT",
    "nirf": 56,
    "location": "Jamshedpur, Jharkhand",
    "state": "Jharkhand",
    "coords": {
      "lat": 22.78,
      "lng": 86.14
    },
    "estd": 1960,
    "accent": "#b45309",
    "heroImage": "/assets/team/NITs/NIT JAMSHEDPUR.jpeg",
    "website": "https://nitjsr.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Jamshedpur is an National Institute of Technology located in Jamshedpur, Jharkhand. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 21000,
      "mess": 33000,
      "other": 9000
    },
    "placements": {
      "avg": 740000,
      "median": 640000,
      "highest": 2810000,
      "placedPct": 82,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 1170000,
        "ece": 770000,
        "ee": 710000,
        "me": 590000,
        "ce": 490000,
        "che": 530000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          11041,
          24536
        ],
        "OBC-NCL": [
          16964,
          45238
        ],
        "EWS": [
          12280,
          29472
        ],
        "SC": [
          36819,
          110456
        ],
        "ST": [
          33753,
          168767
        ]
      },
      "ece": {
        "OPEN": [
          25483,
          56628
        ],
        "OBC-NCL": [
          35459,
          94558
        ],
        "EWS": [
          28238,
          67772
        ],
        "SC": [
          86917,
          260751
        ],
        "ST": [
          69521,
          347607
        ]
      },
      "ee": {
        "OPEN": [
          40088,
          89084
        ],
        "OBC-NCL": [
          58312,
          155499
        ],
        "EWS": [
          47151,
          113163
        ],
        "SC": [
          135977,
          407930
        ],
        "ST": [
          107841,
          539206
        ]
      },
      "me": {
        "OPEN": [
          93957,
          208793
        ],
        "OBC-NCL": [
          110533,
          294755
        ],
        "EWS": [
          92307,
          221536
        ],
        "SC": [
          295563,
          886688
        ],
        "ST": [
          234442,
          1172208
        ]
      },
      "ce": {
        "OPEN": [
          124630,
          276956
        ],
        "OBC-NCL": [
          184823,
          492862
        ],
        "EWS": [
          159893,
          383744
        ],
        "SC": [
          465219,
          1395657
        ],
        "ST": [
          323939,
          1619697
        ]
      },
      "che": {
        "OPEN": [
          65132,
          144738
        ],
        "OBC-NCL": [
          87055,
          232146
        ],
        "EWS": [
          67432,
          161836
        ],
        "SC": [
          224304,
          672912
        ],
        "ST": [
          179474,
          897368
        ]
      }
    }
  },
  {
    "slug": "nit-hamirpur",
    "name": "NIT Hamirpur",
    "short": "NITH",
    "type": "NIT",
    "nirf": 59,
    "location": "Hamirpur, Himachal Pradesh",
    "state": "Himachal Pradesh",
    "coords": {
      "lat": 31.71,
      "lng": 76.53
    },
    "estd": 1986,
    "accent": "#0ea5a4",
    "heroImage": "/assets/team/NITs/NIT HAMIRPUR.jpg",
    "website": "https://nith.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Hamirpur is an National Institute of Technology located in Hamirpur, Himachal Pradesh. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 23000,
      "mess": 33000,
      "other": 9000
    },
    "placements": {
      "avg": 700000,
      "median": 610000,
      "highest": 2940000,
      "placedPct": 80,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 1050000,
        "ece": 680000,
        "ee": 620000,
        "me": 540000,
        "ce": 440000,
        "che": 490000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          14233,
          31630
        ],
        "OBC-NCL": [
          18683,
          49821
        ],
        "EWS": [
          16560,
          39745
        ],
        "SC": [
          48083,
          144250
        ],
        "ST": [
          36900,
          184501
        ]
      },
      "ece": {
        "OPEN": [
          28369,
          63042
        ],
        "OBC-NCL": [
          35229,
          93944
        ],
        "EWS": [
          30872,
          74093
        ],
        "SC": [
          94785,
          284354
        ],
        "ST": [
          69204,
          346019
        ]
      },
      "ee": {
        "OPEN": [
          49446,
          109881
        ],
        "OBC-NCL": [
          74355,
          198279
        ],
        "EWS": [
          59547,
          142913
        ],
        "SC": [
          180716,
          542148
        ],
        "ST": [
          145773,
          728864
        ]
      },
      "me": {
        "OPEN": [
          96432,
          214293
        ],
        "OBC-NCL": [
          120400,
          321066
        ],
        "EWS": [
          99229,
          238149
        ],
        "SC": [
          327842,
          983525
        ],
        "ST": [
          264385,
          1321923
        ]
      },
      "ce": {
        "OPEN": [
          137060,
          304577
        ],
        "OBC-NCL": [
          173118,
          461649
        ],
        "EWS": [
          160125,
          384300
        ],
        "SC": [
          450608,
          1351823
        ],
        "ST": [
          342193,
          1710963
        ]
      },
      "che": {
        "OPEN": [
          76645,
          170323
        ],
        "OBC-NCL": [
          102991,
          274643
        ],
        "EWS": [
          90433,
          217039
        ],
        "SC": [
          235274,
          705823
        ],
        "ST": [
          214139,
          1070695
        ]
      }
    }
  },
  {
    "slug": "nit-raipur",
    "name": "NIT Raipur",
    "short": "NITRR",
    "type": "NIT",
    "nirf": 61,
    "location": "Raipur, Chhattisgarh",
    "state": "Chhattisgarh",
    "coords": {
      "lat": 21.25,
      "lng": 81.6
    },
    "estd": 1956,
    "accent": "#d97706",
    "heroImage": "/assets/team/NITs/NIT RAIPUR.jpg",
    "website": "https://nitrr.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Raipur is an National Institute of Technology located in Raipur, Chhattisgarh. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 23000,
      "mess": 35000,
      "other": 8000
    },
    "placements": {
      "avg": 690000,
      "median": 600000,
      "highest": 2970000,
      "placedPct": 80,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 1090000,
        "ece": 710000,
        "ee": 640000,
        "me": 520000,
        "ce": 450000,
        "che": 480000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          12661,
          28136
        ],
        "OBC-NCL": [
          16245,
          43321
        ],
        "EWS": [
          13230,
          31752
        ],
        "SC": [
          39578,
          118733
        ],
        "ST": [
          31656,
          158280
        ]
      },
      "ece": {
        "OPEN": [
          33533,
          74519
        ],
        "OBC-NCL": [
          45760,
          122027
        ],
        "EWS": [
          36339,
          87213
        ],
        "SC": [
          112930,
          338790
        ],
        "ST": [
          86577,
          432886
        ]
      },
      "ee": {
        "OPEN": [
          52612,
          116915
        ],
        "OBC-NCL": [
          66229,
          176610
        ],
        "EWS": [
          55181,
          132434
        ],
        "SC": [
          171987,
          515960
        ],
        "ST": [
          143220,
          716101
        ]
      },
      "me": {
        "OPEN": [
          83211,
          184913
        ],
        "OBC-NCL": [
          115925,
          309133
        ],
        "EWS": [
          104952,
          251885
        ],
        "SC": [
          270154,
          810461
        ],
        "ST": [
          234067,
          1170334
        ]
      },
      "ce": {
        "OPEN": [
          145516,
          323370
        ],
        "OBC-NCL": [
          207914,
          554437
        ],
        "EWS": [
          158563,
          380552
        ],
        "SC": [
          512511,
          1537534
        ],
        "ST": [
          392626,
          1963128
        ]
      },
      "che": {
        "OPEN": [
          62882,
          139737
        ],
        "OBC-NCL": [
          93595,
          249586
        ],
        "EWS": [
          81678,
          196028
        ],
        "SC": [
          228768,
          686304
        ],
        "ST": [
          198572,
          992862
        ]
      }
    }
  },
  {
    "slug": "nit-patna",
    "name": "NIT Patna",
    "short": "NITP",
    "type": "NIT",
    "nirf": 63,
    "location": "Patna, Bihar",
    "state": "Bihar",
    "coords": {
      "lat": 25.62,
      "lng": 85.17
    },
    "estd": 1886,
    "accent": "#F15A38",
    "heroImage": "/assets/team/NITs/NIT PATNA.jpg",
    "website": "https://nitp.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Patna is an National Institute of Technology located in Patna, Bihar. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 23000,
      "mess": 34000,
      "other": 10000
    },
    "placements": {
      "avg": 670000,
      "median": 580000,
      "highest": 2890000,
      "placedPct": 80,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 1030000,
        "ece": 680000,
        "ee": 640000,
        "me": 550000,
        "ce": 430000,
        "che": 480000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          12832,
          28516
        ],
        "OBC-NCL": [
          17563,
          46834
        ],
        "EWS": [
          15137,
          36328
        ],
        "SC": [
          43968,
          131903
        ],
        "ST": [
          36606,
          183029
        ]
      },
      "ece": {
        "OPEN": [
          27205,
          60456
        ],
        "OBC-NCL": [
          37503,
          100007
        ],
        "EWS": [
          30144,
          72345
        ],
        "SC": [
          86868,
          260605
        ],
        "ST": [
          80422,
          402108
        ]
      },
      "ee": {
        "OPEN": [
          58069,
          129042
        ],
        "OBC-NCL": [
          66843,
          178248
        ],
        "EWS": [
          55713,
          133711
        ],
        "SC": [
          177268,
          531803
        ],
        "ST": [
          130849,
          654243
        ]
      },
      "me": {
        "OPEN": [
          93611,
          208023
        ],
        "OBC-NCL": [
          122606,
          326950
        ],
        "EWS": [
          87199,
          209278
        ],
        "SC": [
          306414,
          919241
        ],
        "ST": [
          247543,
          1237715
        ]
      },
      "ce": {
        "OPEN": [
          146273,
          325051
        ],
        "OBC-NCL": [
          214674,
          572465
        ],
        "EWS": [
          164675,
          395219
        ],
        "SC": [
          461608,
          1384824
        ],
        "ST": [
          382783,
          1913914
        ]
      },
      "che": {
        "OPEN": [
          79370,
          176377
        ],
        "OBC-NCL": [
          114614,
          305636
        ],
        "EWS": [
          88079,
          211389
        ],
        "SC": [
          264284,
          792851
        ],
        "ST": [
          202076,
          1010382
        ]
      }
    }
  },
  {
    "slug": "nit-ap",
    "name": "NIT Andhra Pradesh",
    "short": "NITANP",
    "type": "NIT",
    "nirf": 65,
    "location": "Tadepalligudem, Andhra Pradesh",
    "state": "Andhra Pradesh",
    "coords": {
      "lat": 16.82,
      "lng": 81.52
    },
    "estd": 2015,
    "accent": "#E0421F",
    "heroImage": "/assets/team/NITs/NIT ANDHRAPRADESH.webp",
    "website": "https://nitandhra.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Andhra Pradesh is an National Institute of Technology located in Tadepalligudem, Andhra Pradesh. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 23000,
      "mess": 35000,
      "other": 9000
    },
    "placements": {
      "avg": 650000,
      "median": 570000,
      "highest": 2740000,
      "placedPct": 79,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 980000,
        "ece": 650000,
        "ee": 570000,
        "me": 540000,
        "ce": 390000,
        "che": 470000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          14618,
          32485
        ],
        "OBC-NCL": [
          19718,
          52582
        ],
        "EWS": [
          14833,
          35599
        ],
        "SC": [
          47277,
          141830
        ],
        "ST": [
          36240,
          181200
        ]
      },
      "ece": {
        "OPEN": [
          31960,
          71022
        ],
        "OBC-NCL": [
          39986,
          106629
        ],
        "EWS": [
          34651,
          83162
        ],
        "SC": [
          99496,
          298487
        ],
        "ST": [
          79582,
          397911
        ]
      },
      "ee": {
        "OPEN": [
          55579,
          123509
        ],
        "OBC-NCL": [
          82449,
          219864
        ],
        "EWS": [
          69672,
          167214
        ],
        "SC": [
          189379,
          568137
        ],
        "ST": [
          150192,
          750958
        ]
      },
      "me": {
        "OPEN": [
          105479,
          234397
        ],
        "OBC-NCL": [
          127961,
          341231
        ],
        "EWS": [
          117219,
          281325
        ],
        "SC": [
          353417,
          1060252
        ],
        "ST": [
          280451,
          1402255
        ]
      },
      "ce": {
        "OPEN": [
          144675,
          321501
        ],
        "OBC-NCL": [
          179882,
          479686
        ],
        "EWS": [
          152628,
          366308
        ],
        "SC": [
          522029,
          1566087
        ],
        "ST": [
          365068,
          1825342
        ]
      },
      "che": {
        "OPEN": [
          74689,
          165975
        ],
        "OBC-NCL": [
          104231,
          277950
        ],
        "EWS": [
          77036,
          184887
        ],
        "SC": [
          233045,
          699135
        ],
        "ST": [
          186470,
          932352
        ]
      }
    }
  },
  {
    "slug": "nit-agartala",
    "name": "NIT Agartala",
    "short": "NITA",
    "type": "NIT",
    "nirf": 67,
    "location": "Agartala, Tripura",
    "state": "Tripura",
    "coords": {
      "lat": 23.83,
      "lng": 91.28
    },
    "estd": 1965,
    "accent": "#d97706",
    "heroImage": "/assets/team/NITs/NIT AGARTALA.jpg",
    "website": "https://nita.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Agartala is an National Institute of Technology located in Agartala, Tripura. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 21000,
      "mess": 33000,
      "other": 9000
    },
    "placements": {
      "avg": 700000,
      "median": 610000,
      "highest": 2650000,
      "placedPct": 80,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 1080000,
        "ece": 690000,
        "ee": 660000,
        "me": 560000,
        "ce": 420000,
        "che": 500000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          12587,
          27970
        ],
        "OBC-NCL": [
          16001,
          42668
        ],
        "EWS": [
          14228,
          34147
        ],
        "SC": [
          39987,
          119960
        ],
        "ST": [
          33137,
          165686
        ]
      },
      "ece": {
        "OPEN": [
          31218,
          69372
        ],
        "OBC-NCL": [
          40116,
          106977
        ],
        "EWS": [
          32353,
          77647
        ],
        "SC": [
          105425,
          316275
        ],
        "ST": [
          78001,
          390007
        ]
      },
      "ee": {
        "OPEN": [
          52238,
          116085
        ],
        "OBC-NCL": [
          66493,
          177314
        ],
        "EWS": [
          54221,
          130130
        ],
        "SC": [
          173559,
          520678
        ],
        "ST": [
          149687,
          748436
        ]
      },
      "me": {
        "OPEN": [
          115075,
          255722
        ],
        "OBC-NCL": [
          154205,
          411214
        ],
        "EWS": [
          128654,
          308771
        ],
        "SC": [
          357715,
          1073144
        ],
        "ST": [
          298372,
          1491861
        ]
      },
      "ce": {
        "OPEN": [
          141416,
          314257
        ],
        "OBC-NCL": [
          180087,
          480232
        ],
        "EWS": [
          144287,
          346288
        ],
        "SC": [
          500344,
          1501033
        ],
        "ST": [
          397092,
          1985458
        ]
      },
      "che": {
        "OPEN": [
          82723,
          183829
        ],
        "OBC-NCL": [
          99007,
          264018
        ],
        "EWS": [
          90773,
          217855
        ],
        "SC": [
          262864,
          788591
        ],
        "ST": [
          220705,
          1103524
        ]
      }
    }
  },
  {
    "slug": "nit-srinagar",
    "name": "NIT Srinagar",
    "short": "NITSRI",
    "type": "NIT",
    "nirf": 69,
    "location": "Srinagar, Jammu & Kashmir",
    "state": "Jammu & Kashmir",
    "coords": {
      "lat": 34.12,
      "lng": 74.84
    },
    "estd": 1960,
    "accent": "#c2410c",
    "heroImage": "/assets/team/NITs/NIT SRINAGAR.jpg",
    "website": "https://nitsri.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Srinagar is an National Institute of Technology located in Srinagar, Jammu & Kashmir. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 20000,
      "mess": 31000,
      "other": 10000
    },
    "placements": {
      "avg": 650000,
      "median": 570000,
      "highest": 2190000,
      "placedPct": 81,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 970000,
        "ece": 630000,
        "ee": 570000,
        "me": 490000,
        "ce": 420000,
        "che": 490000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          12617,
          28037
        ],
        "OBC-NCL": [
          16445,
          43852
        ],
        "EWS": [
          14173,
          34016
        ],
        "SC": [
          43533,
          130600
        ],
        "ST": [
          35186,
          175930
        ]
      },
      "ece": {
        "OPEN": [
          34814,
          77364
        ],
        "OBC-NCL": [
          47649,
          127063
        ],
        "EWS": [
          38111,
          91466
        ],
        "SC": [
          119082,
          357246
        ],
        "ST": [
          95250,
          476249
        ]
      },
      "ee": {
        "OPEN": [
          62364,
          138586
        ],
        "OBC-NCL": [
          79537,
          212098
        ],
        "EWS": [
          74384,
          178521
        ],
        "SC": [
          214077,
          642231
        ],
        "ST": [
          169858,
          849288
        ]
      },
      "me": {
        "OPEN": [
          100128,
          222506
        ],
        "OBC-NCL": [
          144891,
          386376
        ],
        "EWS": [
          121154,
          290770
        ],
        "SC": [
          393945,
          1181834
        ],
        "ST": [
          312712,
          1563560
        ]
      },
      "ce": {
        "OPEN": [
          154396,
          343103
        ],
        "OBC-NCL": [
          217895,
          581054
        ],
        "EWS": [
          187208,
          449300
        ],
        "SC": [
          527758,
          1583275
        ],
        "ST": [
          439703,
          2198515
        ]
      },
      "che": {
        "OPEN": [
          93168,
          207039
        ],
        "OBC-NCL": [
          119445,
          318520
        ],
        "EWS": [
          106356,
          255255
        ],
        "SC": [
          301573,
          904718
        ],
        "ST": [
          241300,
          1206502
        ]
      }
    }
  },
  {
    "slug": "nit-goa",
    "name": "NIT Goa",
    "short": "NITGoa",
    "type": "NIT",
    "nirf": 71,
    "location": "Cuncolim, Goa",
    "state": "Goa",
    "coords": {
      "lat": 15.18,
      "lng": 74
    },
    "estd": 2010,
    "accent": "#0ea5a4",
    "heroImage": "/assets/team/NITs/NIT GOA.jpeg",
    "website": "https://nitgoa.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Goa is an National Institute of Technology located in Cuncolim, Goa. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 20000,
      "mess": 31000,
      "other": 9000
    },
    "placements": {
      "avg": 620000,
      "median": 540000,
      "highest": 2060000,
      "placedPct": 81,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 940000,
        "ece": 620000,
        "ee": 590000,
        "me": 480000,
        "ce": 380000,
        "che": 460000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          16563,
          36807
        ],
        "OBC-NCL": [
          19585,
          52227
        ],
        "EWS": [
          16093,
          38622
        ],
        "SC": [
          55668,
          167003
        ],
        "ST": [
          38973,
          194864
        ]
      },
      "ece": {
        "OPEN": [
          33869,
          75264
        ],
        "OBC-NCL": [
          48496,
          129322
        ],
        "EWS": [
          37442,
          89861
        ],
        "SC": [
          119006,
          357017
        ],
        "ST": [
          90401,
          452003
        ]
      },
      "ee": {
        "OPEN": [
          55430,
          123178
        ],
        "OBC-NCL": [
          74681,
          199149
        ],
        "EWS": [
          65279,
          156670
        ],
        "SC": [
          199027,
          597080
        ],
        "ST": [
          167390,
          836950
        ]
      },
      "me": {
        "OPEN": [
          115115,
          255811
        ],
        "OBC-NCL": [
          144759,
          386025
        ],
        "EWS": [
          117080,
          280993
        ],
        "SC": [
          353322,
          1059967
        ],
        "ST": [
          271206,
          1356032
        ]
      },
      "ce": {
        "OPEN": [
          170469,
          378819
        ],
        "OBC-NCL": [
          220981,
          589284
        ],
        "EWS": [
          189171,
          454010
        ],
        "SC": [
          560649,
          1681946
        ],
        "ST": [
          432867,
          2164333
        ]
      },
      "che": {
        "OPEN": [
          92544,
          205654
        ],
        "OBC-NCL": [
          126233,
          336622
        ],
        "EWS": [
          113592,
          272622
        ],
        "SC": [
          343088,
          1029264
        ],
        "ST": [
          248724,
          1243619
        ]
      }
    }
  },
  {
    "slug": "nit-delhi",
    "name": "NIT Delhi",
    "short": "NITD",
    "type": "NIT",
    "nirf": 73,
    "location": "Narela, Delhi",
    "state": "Delhi",
    "coords": {
      "lat": 28.85,
      "lng": 77.1
    },
    "estd": 2010,
    "accent": "#15803d",
    "heroImage": "/assets/team/NITs/NIT DELHI.png",
    "website": "https://nitdelhi.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Delhi is an National Institute of Technology located in Narela, Delhi. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 23000,
      "mess": 33000,
      "other": 9000
    },
    "placements": {
      "avg": 680000,
      "median": 590000,
      "highest": 2900000,
      "placedPct": 79,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 990000,
        "ece": 720000,
        "ee": 650000,
        "me": 560000,
        "ce": 440000,
        "che": 490000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          17356,
          38568
        ],
        "OBC-NCL": [
          23261,
          62029
        ],
        "EWS": [
          19020,
          45647
        ],
        "SC": [
          60961,
          182884
        ],
        "ST": [
          48392,
          241960
        ]
      },
      "ece": {
        "OPEN": [
          38847,
          86327
        ],
        "OBC-NCL": [
          50815,
          135507
        ],
        "EWS": [
          39932,
          95837
        ],
        "SC": [
          123336,
          370009
        ],
        "ST": [
          103944,
          519720
        ]
      },
      "ee": {
        "OPEN": [
          62107,
          138016
        ],
        "OBC-NCL": [
          73129,
          195011
        ],
        "EWS": [
          63580,
          152592
        ],
        "SC": [
          193817,
          581450
        ],
        "ST": [
          161664,
          808319
        ]
      },
      "me": {
        "OPEN": [
          117695,
          261544
        ],
        "OBC-NCL": [
          160836,
          428897
        ],
        "EWS": [
          132379,
          317710
        ],
        "SC": [
          402487,
          1207461
        ],
        "ST": [
          281781,
          1408906
        ]
      },
      "ce": {
        "OPEN": [
          159067,
          353483
        ],
        "OBC-NCL": [
          203719,
          543250
        ],
        "EWS": [
          177154,
          425169
        ],
        "SC": [
          552483,
          1657448
        ],
        "ST": [
          405687,
          2028437
        ]
      },
      "che": {
        "OPEN": [
          74316,
          165146
        ],
        "OBC-NCL": [
          108768,
          290047
        ],
        "EWS": [
          91172,
          218813
        ],
        "SC": [
          258657,
          775972
        ],
        "ST": [
          227177,
          1135884
        ]
      }
    }
  },
  {
    "slug": "nit-ap-puducherry",
    "name": "NIT Puducherry",
    "short": "NITPY",
    "type": "NIT",
    "nirf": 75,
    "location": "Karaikal, Puducherry",
    "state": "Puducherry",
    "coords": {
      "lat": 10.92,
      "lng": 79.83
    },
    "estd": 2010,
    "accent": "#9a3412",
    "heroImage": "/assets/team/NITs/NIT PUDUCHERRY.webp",
    "website": "https://nitpy.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Puducherry is an National Institute of Technology located in Karaikal, Puducherry. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 24000,
      "mess": 30000,
      "other": 9000
    },
    "placements": {
      "avg": 660000,
      "median": 570000,
      "highest": 3050000,
      "placedPct": 77,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 1010000,
        "ece": 640000,
        "ee": 600000,
        "me": 500000,
        "ce": 400000,
        "che": 480000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          15327,
          34059
        ],
        "OBC-NCL": [
          19852,
          52939
        ],
        "EWS": [
          18828,
          45187
        ],
        "SC": [
          51182,
          153546
        ],
        "ST": [
          40938,
          204691
        ]
      },
      "ece": {
        "OPEN": [
          35898,
          79773
        ],
        "OBC-NCL": [
          46237,
          123299
        ],
        "EWS": [
          39016,
          93638
        ],
        "SC": [
          102315,
          306945
        ],
        "ST": [
          82793,
          413965
        ]
      },
      "ee": {
        "OPEN": [
          54478,
          121062
        ],
        "OBC-NCL": [
          76174,
          203131
        ],
        "EWS": [
          66699,
          160077
        ],
        "SC": [
          184147,
          552442
        ],
        "ST": [
          158557,
          792785
        ]
      },
      "me": {
        "OPEN": [
          90060,
          200132
        ],
        "OBC-NCL": [
          126592,
          337579
        ],
        "EWS": [
          110636,
          265527
        ],
        "SC": [
          298718,
          896155
        ],
        "ST": [
          249769,
          1248843
        ]
      },
      "ce": {
        "OPEN": [
          162565,
          361256
        ],
        "OBC-NCL": [
          194061,
          517497
        ],
        "EWS": [
          174539,
          418893
        ],
        "SC": [
          538028,
          1614084
        ],
        "ST": [
          412871,
          2064354
        ]
      },
      "che": {
        "OPEN": [
          93241,
          207203
        ],
        "OBC-NCL": [
          131170,
          349787
        ],
        "EWS": [
          105414,
          252994
        ],
        "SC": [
          291747,
          875240
        ],
        "ST": [
          253941,
          1269707
        ]
      }
    }
  },
  {
    "slug": "nit-meghalaya",
    "name": "NIT Meghalaya",
    "short": "NITMeg",
    "type": "NIT",
    "nirf": 77,
    "location": "Shillong, Meghalaya",
    "state": "Meghalaya",
    "coords": {
      "lat": 25.57,
      "lng": 91.88
    },
    "estd": 2010,
    "accent": "#fb923c",
    "heroImage": "/assets/team/NITs/NIT MEGHALAYA.jpeg",
    "website": "https://nitm.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Meghalaya is an National Institute of Technology located in Shillong, Meghalaya. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 23000,
      "mess": 35000,
      "other": 8000
    },
    "placements": {
      "avg": 650000,
      "median": 570000,
      "highest": 2870000,
      "placedPct": 76,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 990000,
        "ece": 640000,
        "ee": 580000,
        "me": 500000,
        "ce": 410000,
        "che": 490000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          17261,
          38358
        ],
        "OBC-NCL": [
          23441,
          62508
        ],
        "EWS": [
          19340,
          46416
        ],
        "SC": [
          59450,
          178349
        ],
        "ST": [
          47930,
          239652
        ]
      },
      "ece": {
        "OPEN": [
          35043,
          77874
        ],
        "OBC-NCL": [
          44053,
          117474
        ],
        "EWS": [
          39592,
          95022
        ],
        "SC": [
          109413,
          328238
        ],
        "ST": [
          96374,
          481872
        ]
      },
      "ee": {
        "OPEN": [
          62143,
          138095
        ],
        "OBC-NCL": [
          89260,
          238026
        ],
        "EWS": [
          68390,
          164136
        ],
        "SC": [
          205827,
          617481
        ],
        "ST": [
          179417,
          897085
        ]
      },
      "me": {
        "OPEN": [
          114092,
          253537
        ],
        "OBC-NCL": [
          165202,
          440539
        ],
        "EWS": [
          135946,
          326271
        ],
        "SC": [
          384694,
          1154082
        ],
        "ST": [
          323893,
          1619465
        ]
      },
      "ce": {
        "OPEN": [
          183120,
          406932
        ],
        "OBC-NCL": [
          257665,
          687106
        ],
        "EWS": [
          210548,
          505315
        ],
        "SC": [
          601900,
          1805700
        ],
        "ST": [
          481612,
          2408060
        ]
      },
      "che": {
        "OPEN": [
          90570,
          201268
        ],
        "OBC-NCL": [
          124922,
          333126
        ],
        "EWS": [
          102711,
          246506
        ],
        "SC": [
          342490,
          1027469
        ],
        "ST": [
          239097,
          1195487
        ]
      }
    }
  },
  {
    "slug": "nit-arunachal",
    "name": "NIT Arunachal Pradesh",
    "short": "NITAP",
    "type": "NIT",
    "nirf": 79,
    "location": "Jote, Arunachal Pradesh",
    "state": "Arunachal Pradesh",
    "coords": {
      "lat": 27.1,
      "lng": 93.69
    },
    "estd": 2010,
    "accent": "#f59e0b",
    "heroImage": "/assets/team/NITs/NIT ARRUNACHAL PRADESH.jpeg",
    "website": "https://nitap.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Arunachal Pradesh is an National Institute of Technology located in Jote, Arunachal Pradesh. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 23000,
      "mess": 35000,
      "other": 8000
    },
    "placements": {
      "avg": 600000,
      "median": 520000,
      "highest": 2620000,
      "placedPct": 79,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 870000,
        "ece": 610000,
        "ee": 530000,
        "me": 480000,
        "ce": 390000,
        "che": 410000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          17114,
          38030
        ],
        "OBC-NCL": [
          21415,
          57106
        ],
        "EWS": [
          18113,
          43471
        ],
        "SC": [
          52763,
          158289
        ],
        "ST": [
          43652,
          218259
        ]
      },
      "ece": {
        "OPEN": [
          37776,
          83946
        ],
        "OBC-NCL": [
          50687,
          135166
        ],
        "EWS": [
          40116,
          96279
        ],
        "SC": [
          129337,
          388010
        ],
        "ST": [
          95853,
          479265
        ]
      },
      "ee": {
        "OPEN": [
          57995,
          128878
        ],
        "OBC-NCL": [
          82243,
          219315
        ],
        "EWS": [
          69929,
          167829
        ],
        "SC": [
          206170,
          618509
        ],
        "ST": [
          148895,
          744473
        ]
      },
      "me": {
        "OPEN": [
          124419,
          276487
        ],
        "OBC-NCL": [
          158222,
          421926
        ],
        "EWS": [
          132597,
          318232
        ],
        "SC": [
          394402,
          1183206
        ],
        "ST": [
          329190,
          1645948
        ]
      },
      "ce": {
        "OPEN": [
          156779,
          348397
        ],
        "OBC-NCL": [
          202977,
          541272
        ],
        "EWS": [
          174494,
          418785
        ],
        "SC": [
          571991,
          1715972
        ],
        "ST": [
          453893,
          2269464
        ]
      },
      "che": {
        "OPEN": [
          91255,
          202789
        ],
        "OBC-NCL": [
          115306,
          307482
        ],
        "EWS": [
          104414,
          250594
        ],
        "SC": [
          294852,
          884555
        ],
        "ST": [
          248398,
          1241988
        ]
      }
    }
  },
  {
    "slug": "nit-manipur",
    "name": "NIT Manipur",
    "short": "NITMN",
    "type": "NIT",
    "nirf": 81,
    "location": "Imphal, Manipur",
    "state": "Manipur",
    "coords": {
      "lat": 24.75,
      "lng": 93.91
    },
    "estd": 2010,
    "accent": "#0d9488",
    "heroImage": "/assets/team/NITs/NIT MANIPUR.jpeg",
    "website": "https://nitmanipur.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Manipur is an National Institute of Technology located in Imphal, Manipur. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 23000,
      "mess": 33000,
      "other": 9000
    },
    "placements": {
      "avg": 610000,
      "median": 530000,
      "highest": 2560000,
      "placedPct": 77,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 900000,
        "ece": 610000,
        "ee": 560000,
        "me": 490000,
        "ce": 390000,
        "che": 440000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          16207,
          36015
        ],
        "OBC-NCL": [
          23828,
          63542
        ],
        "EWS": [
          20378,
          48908
        ],
        "SC": [
          59087,
          177260
        ],
        "ST": [
          47277,
          236387
        ]
      },
      "ece": {
        "OPEN": [
          34115,
          75812
        ],
        "OBC-NCL": [
          44639,
          119038
        ],
        "EWS": [
          39673,
          95214
        ],
        "SC": [
          123193,
          369578
        ],
        "ST": [
          88673,
          443365
        ]
      },
      "ee": {
        "OPEN": [
          68106,
          151346
        ],
        "OBC-NCL": [
          98432,
          262485
        ],
        "EWS": [
          77061,
          184946
        ],
        "SC": [
          248398,
          745193
        ],
        "ST": [
          198684,
          993419
        ]
      },
      "me": {
        "OPEN": [
          129655,
          288122
        ],
        "OBC-NCL": [
          169884,
          453025
        ],
        "EWS": [
          133127,
          319505
        ],
        "SC": [
          382121,
          1146364
        ],
        "ST": [
          334807,
          1674037
        ]
      },
      "ce": {
        "OPEN": [
          195337,
          434082
        ],
        "OBC-NCL": [
          253074,
          674865
        ],
        "EWS": [
          184632,
          443117
        ],
        "SC": [
          555290,
          1665869
        ],
        "ST": [
          509664,
          2548322
        ]
      },
      "che": {
        "OPEN": [
          91510,
          203357
        ],
        "OBC-NCL": [
          129537,
          345433
        ],
        "EWS": [
          94542,
          226901
        ],
        "SC": [
          296294,
          888883
        ],
        "ST": [
          226547,
          1132735
        ]
      }
    }
  },
  {
    "slug": "nit-mizoram",
    "name": "NIT Mizoram",
    "short": "NITMZ",
    "type": "NIT",
    "nirf": 83,
    "location": "Aizawl, Mizoram",
    "state": "Mizoram",
    "coords": {
      "lat": 23.73,
      "lng": 92.72
    },
    "estd": 2010,
    "accent": "#b45309",
    "heroImage": "/assets/team/NITs/NIT MIZORAM.jpeg",
    "website": "https://nitmz.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Mizoram is an National Institute of Technology located in Aizawl, Mizoram. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 24000,
      "mess": 30000,
      "other": 9000
    },
    "placements": {
      "avg": 600000,
      "median": 520000,
      "highest": 2800000,
      "placedPct": 76,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 930000,
        "ece": 630000,
        "ee": 530000,
        "me": 460000,
        "ce": 360000,
        "che": 420000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          18008,
          40017
        ],
        "OBC-NCL": [
          26459,
          70557
        ],
        "EWS": [
          19969,
          47925
        ],
        "SC": [
          55966,
          167897
        ],
        "ST": [
          49731,
          248654
        ]
      },
      "ece": {
        "OPEN": [
          42444,
          94321
        ],
        "OBC-NCL": [
          55458,
          147887
        ],
        "EWS": [
          47886,
          114927
        ],
        "SC": [
          135660,
          406980
        ],
        "ST": [
          112266,
          561328
        ]
      },
      "ee": {
        "OPEN": [
          68770,
          152823
        ],
        "OBC-NCL": [
          81167,
          216446
        ],
        "EWS": [
          76737,
          184168
        ],
        "SC": [
          230093,
          690279
        ],
        "ST": [
          176609,
          883046
        ]
      },
      "me": {
        "OPEN": [
          124545,
          276766
        ],
        "OBC-NCL": [
          180748,
          481995
        ],
        "EWS": [
          155578,
          373387
        ],
        "SC": [
          455050,
          1365149
        ],
        "ST": [
          348843,
          1744213
        ]
      },
      "ce": {
        "OPEN": [
          203496,
          452213
        ],
        "OBC-NCL": [
          266533,
          710754
        ],
        "EWS": [
          228920,
          549408
        ],
        "SC": [
          676118,
          2028354
        ],
        "ST": [
          564088,
          2820438
        ]
      },
      "che": {
        "OPEN": [
          125147,
          278104
        ],
        "OBC-NCL": [
          141099,
          376263
        ],
        "EWS": [
          117285,
          281483
        ],
        "SC": [
          381312,
          1143936
        ],
        "ST": [
          294557,
          1472787
        ]
      }
    }
  },
  {
    "slug": "nit-nagaland",
    "name": "NIT Nagaland",
    "short": "NITN",
    "type": "NIT",
    "nirf": 87,
    "location": "Dimapur, Nagaland",
    "state": "Nagaland",
    "coords": {
      "lat": 25.91,
      "lng": 93.72
    },
    "estd": 2010,
    "accent": "#e8590c",
    "heroImage": "/assets/team/NITs/NIT NAGALAND.jpeg",
    "website": "https://nitnagaland.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Nagaland is an National Institute of Technology located in Dimapur, Nagaland. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 22000,
      "mess": 32000,
      "other": 8000
    },
    "placements": {
      "avg": 580000,
      "median": 500000,
      "highest": 2250000,
      "placedPct": 77,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 840000,
        "ece": 580000,
        "ee": 520000,
        "me": 470000,
        "ce": 350000,
        "che": 410000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          19152,
          42559
        ],
        "OBC-NCL": [
          25885,
          69025
        ],
        "EWS": [
          22148,
          53156
        ],
        "SC": [
          61221,
          183664
        ],
        "ST": [
          48986,
          244930
        ]
      },
      "ece": {
        "OPEN": [
          40984,
          91076
        ],
        "OBC-NCL": [
          53316,
          142177
        ],
        "EWS": [
          45578,
          109388
        ],
        "SC": [
          131943,
          395828
        ],
        "ST": [
          113819,
          569094
        ]
      },
      "ee": {
        "OPEN": [
          65592,
          145760
        ],
        "OBC-NCL": [
          91865,
          244973
        ],
        "EWS": [
          75409,
          180982
        ],
        "SC": [
          205428,
          616285
        ],
        "ST": [
          164312,
          821562
        ]
      },
      "me": {
        "OPEN": [
          146992,
          326650
        ],
        "OBC-NCL": [
          170005,
          453347
        ],
        "EWS": [
          143529,
          344470
        ],
        "SC": [
          447475,
          1342424
        ],
        "ST": [
          370326,
          1851629
        ]
      },
      "ce": {
        "OPEN": [
          209460,
          465466
        ],
        "OBC-NCL": [
          292233,
          779289
        ],
        "EWS": [
          221012,
          530429
        ],
        "SC": [
          720675,
          2162025
        ],
        "ST": [
          553630,
          2768148
        ]
      },
      "che": {
        "OPEN": [
          99721,
          221602
        ],
        "OBC-NCL": [
          146449,
          390530
        ],
        "EWS": [
          119764,
          287433
        ],
        "SC": [
          324157,
          972471
        ],
        "ST": [
          296885,
          1484423
        ]
      }
    }
  },
  {
    "slug": "nit-sikkim",
    "name": "NIT Sikkim",
    "short": "NITSKM",
    "type": "NIT",
    "nirf": 89,
    "location": "Ravangla, Sikkim",
    "state": "Sikkim",
    "coords": {
      "lat": 27.31,
      "lng": 88.36
    },
    "estd": 2010,
    "accent": "#a16207",
    "heroImage": "/assets/team/NITs/NIT SIKKIM.jpg",
    "website": "https://nitsikkim.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Sikkim is an National Institute of Technology located in Ravangla, Sikkim. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 22000,
      "mess": 33000,
      "other": 9000
    },
    "placements": {
      "avg": 600000,
      "median": 520000,
      "highest": 2500000,
      "placedPct": 75,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 880000,
        "ece": 610000,
        "ee": 560000,
        "me": 470000,
        "ce": 380000,
        "che": 430000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          17703,
          39339
        ],
        "OBC-NCL": [
          22252,
          59339
        ],
        "EWS": [
          20206,
          48495
        ],
        "SC": [
          56990,
          170969
        ],
        "ST": [
          43680,
          218402
        ]
      },
      "ece": {
        "OPEN": [
          44324,
          98498
        ],
        "OBC-NCL": [
          63331,
          168883
        ],
        "EWS": [
          47875,
          114900
        ],
        "SC": [
          145992,
          437975
        ],
        "ST": [
          126939,
          634694
        ]
      },
      "ee": {
        "OPEN": [
          70292,
          156205
        ],
        "OBC-NCL": [
          79261,
          211364
        ],
        "EWS": [
          71449,
          171477
        ],
        "SC": [
          197769,
          593307
        ],
        "ST": [
          159661,
          798307
        ]
      },
      "me": {
        "OPEN": [
          126625,
          281388
        ],
        "OBC-NCL": [
          173601,
          462935
        ],
        "EWS": [
          142757,
          342617
        ],
        "SC": [
          459522,
          1378566
        ],
        "ST": [
          370491,
          1852453
        ]
      },
      "ce": {
        "OPEN": [
          230534,
          512298
        ],
        "OBC-NCL": [
          292747,
          780658
        ],
        "EWS": [
          234381,
          562515
        ],
        "SC": [
          724396,
          2173188
        ],
        "ST": [
          550150,
          2750750
        ]
      },
      "che": {
        "OPEN": [
          120519,
          267820
        ],
        "OBC-NCL": [
          146416,
          390442
        ],
        "EWS": [
          134776,
          323463
        ],
        "SC": [
          373768,
          1121303
        ],
        "ST": [
          339200,
          1696002
        ]
      }
    }
  },
  {
    "slug": "nit-uttarakhand",
    "name": "NIT Uttarakhand",
    "short": "NITUK",
    "type": "NIT",
    "nirf": 91,
    "location": "Srinagar, Uttarakhand",
    "state": "Uttarakhand",
    "coords": {
      "lat": 30.22,
      "lng": 78.78
    },
    "estd": 2009,
    "accent": "#047857",
    "heroImage": "/assets/team/NITs/NIT UTTARAKHAND.jpg",
    "website": "https://nituk.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "NIT Uttarakhand is an National Institute of Technology located in Srinagar, Uttarakhand. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 150000,
      "hostel": 21000,
      "mess": 32000,
      "other": 9000
    },
    "placements": {
      "avg": 630000,
      "median": 550000,
      "highest": 2280000,
      "placedPct": 76,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "L&T",
        "Deloitte",
        "Cisco",
        "TCS Digital"
      ],
      "byBranch": {
        "cse": 910000,
        "ece": 640000,
        "ee": 560000,
        "me": 480000,
        "ce": 400000,
        "che": 480000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          16997,
          37772
        ],
        "OBC-NCL": [
          24485,
          65293
        ],
        "EWS": [
          19530,
          46872
        ],
        "SC": [
          58183,
          174548
        ],
        "ST": [
          48142,
          240711
        ]
      },
      "ece": {
        "OPEN": [
          48086,
          106858
        ],
        "OBC-NCL": [
          59325,
          158199
        ],
        "EWS": [
          46550,
          111719
        ],
        "SC": [
          153770,
          461309
        ],
        "ST": [
          113923,
          569616
        ]
      },
      "ee": {
        "OPEN": [
          86785,
          192856
        ],
        "OBC-NCL": [
          108798,
          290129
        ],
        "EWS": [
          83517,
          200441
        ],
        "SC": [
          263590,
          790770
        ],
        "ST": [
          227263,
          1136315
        ]
      },
      "me": {
        "OPEN": [
          119436,
          265413
        ],
        "OBC-NCL": [
          151457,
          403886
        ],
        "EWS": [
          137184,
          329242
        ],
        "SC": [
          363859,
          1091577
        ],
        "ST": [
          304564,
          1522819
        ]
      },
      "ce": {
        "OPEN": [
          219113,
          486917
        ],
        "OBC-NCL": [
          298827,
          796872
        ],
        "EWS": [
          219914,
          527795
        ],
        "SC": [
          717171,
          2151512
        ],
        "ST": [
          569053,
          2845263
        ]
      },
      "che": {
        "OPEN": [
          107801,
          239558
        ],
        "OBC-NCL": [
          124836,
          332896
        ],
        "EWS": [
          112431,
          269834
        ],
        "SC": [
          324722,
          974165
        ],
        "ST": [
          273623,
          1368116
        ]
      }
    }
  },
  {
    "slug": "iiit-hyderabad",
    "name": "IIIT Hyderabad",
    "short": "IIIT-H",
    "type": "IIIT",
    "nirf": 45,
    "location": "Gachibowli, Hyderabad, Telangana",
    "state": "Telangana",
    "coords": {
      "lat": 17.45,
      "lng": 78.35
    },
    "estd": 1998,
    "accent": "#dc6803",
    "heroImage": "/assets/team/IIITs/IIIT HYDERABAD.jpg",
    "website": "https://iiit.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIIT Hyderabad is an Indian Institute of Information Technology located in Gachibowli, Hyderabad, Telangana. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 28000,
      "mess": 34000,
      "other": 13000
    },
    "placements": {
      "avg": 3080000,
      "median": 2680000,
      "highest": 7560000,
      "placedPct": 93,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 4440000,
        "ai": 4360000,
        "ece": 3250000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          6880,
          15288
        ],
        "OBC-NCL": [
          8999,
          23997
        ],
        "EWS": [
          8204,
          19690
        ],
        "SC": [
          21511,
          64534
        ],
        "ST": [
          17055,
          85274
        ]
      },
      "ai": {
        "OPEN": [
          10969,
          24376
        ],
        "OBC-NCL": [
          12999,
          34663
        ],
        "EWS": [
          10925,
          26219
        ],
        "SC": [
          36675,
          110026
        ],
        "ST": [
          25588,
          127939
        ]
      },
      "ece": {
        "OPEN": [
          18423,
          40941
        ],
        "OBC-NCL": [
          27419,
          73118
        ],
        "EWS": [
          21969,
          52727
        ],
        "SC": [
          62929,
          188787
        ],
        "ST": [
          50243,
          251217
        ]
      }
    }
  },
  {
    "slug": "iiit-allahabad",
    "name": "IIIT Allahabad",
    "short": "IIIT-A",
    "type": "IIIT",
    "nirf": 84,
    "location": "Prayagraj, Uttar Pradesh",
    "state": "Uttar Pradesh",
    "coords": {
      "lat": 25.43,
      "lng": 81.77
    },
    "estd": 1999,
    "accent": "#ca8a04",
    "heroImage": "/assets/team/IIITs/IIIT ALLAHABHAD.jpg",
    "website": "https://iiita.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIIT Allahabad is an Indian Institute of Information Technology located in Prayagraj, Uttar Pradesh. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 31000,
      "mess": 38000,
      "other": 12000
    },
    "placements": {
      "avg": 1430000,
      "median": 1240000,
      "highest": 4510000,
      "placedPct": 84,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 2220000,
        "ai": 2170000,
        "ece": 1440000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          13519,
          30041
        ],
        "OBC-NCL": [
          18853,
          50276
        ],
        "EWS": [
          14574,
          34978
        ],
        "SC": [
          44708,
          134125
        ],
        "ST": [
          40893,
          204466
        ]
      },
      "ai": {
        "OPEN": [
          17239,
          38309
        ],
        "OBC-NCL": [
          22970,
          61253
        ],
        "EWS": [
          19816,
          47559
        ],
        "SC": [
          51718,
          155153
        ],
        "ST": [
          41745,
          208727
        ]
      },
      "ece": {
        "OPEN": [
          35209,
          78241
        ],
        "OBC-NCL": [
          43239,
          115305
        ],
        "EWS": [
          35244,
          84587
        ],
        "SC": [
          112007,
          336021
        ],
        "ST": [
          81429,
          407143
        ]
      }
    }
  },
  {
    "slug": "iiitm-gwalior",
    "name": "ABV-IIITM Gwalior",
    "short": "IIITM-G",
    "type": "IIIT",
    "nirf": 96,
    "location": "Gwalior, Madhya Pradesh",
    "state": "Madhya Pradesh",
    "coords": {
      "lat": 26.25,
      "lng": 78.21
    },
    "estd": 1997,
    "accent": "#F15A38",
    "heroImage": "/assets/team/IIITs/IIIT GWALIOR.jpeg",
    "website": "https://iiitm.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "ABV-IIITM Gwalior is an Indian Institute of Information Technology located in Gwalior, Madhya Pradesh. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 29000,
      "mess": 34000,
      "other": 13000
    },
    "placements": {
      "avg": 1160000,
      "median": 1010000,
      "highest": 3010000,
      "placedPct": 85,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 1680000,
        "ai": 1780000,
        "ece": 1120000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          15723,
          34940
        ],
        "OBC-NCL": [
          21014,
          56038
        ],
        "EWS": [
          16950,
          40680
        ],
        "SC": [
          54106,
          162317
        ],
        "ST": [
          43292,
          216458
        ]
      },
      "ai": {
        "OPEN": [
          19647,
          43661
        ],
        "OBC-NCL": [
          24046,
          64122
        ],
        "EWS": [
          19328,
          46386
        ],
        "SC": [
          66300,
          198901
        ],
        "ST": [
          53031,
          265157
        ]
      },
      "ece": {
        "OPEN": [
          38253,
          85006
        ],
        "OBC-NCL": [
          47787,
          127432
        ],
        "EWS": [
          38624,
          92697
        ],
        "SC": [
          118446,
          355338
        ],
        "ST": [
          102059,
          510293
        ]
      }
    }
  },
  {
    "slug": "iiitdm-jabalpur",
    "name": "IIITDM Jabalpur",
    "short": "IIITDM-J",
    "type": "IIIT",
    "nirf": 78,
    "location": "Jabalpur, Madhya Pradesh",
    "state": "Madhya Pradesh",
    "coords": {
      "lat": 23.18,
      "lng": 79.91
    },
    "estd": 2005,
    "accent": "#b45309",
    "heroImage": "/assets/team/IIITs/IIIT JABALPUR.jpeg",
    "website": "https://iiitdmj.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIITDM Jabalpur is an Indian Institute of Information Technology located in Jabalpur, Madhya Pradesh. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 28000,
      "mess": 34000,
      "other": 13000
    },
    "placements": {
      "avg": 1480000,
      "median": 1290000,
      "highest": 3680000,
      "placedPct": 88,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 2140000,
        "ai": 2150000,
        "ece": 1560000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          10984,
          24408
        ],
        "OBC-NCL": [
          15617,
          41647
        ],
        "EWS": [
          12543,
          30103
        ],
        "SC": [
          34898,
          104695
        ],
        "ST": [
          27669,
          138344
        ]
      },
      "ai": {
        "OPEN": [
          18929,
          42064
        ],
        "OBC-NCL": [
          23347,
          62259
        ],
        "EWS": [
          21126,
          50703
        ],
        "SC": [
          62038,
          186115
        ],
        "ST": [
          51783,
          258917
        ]
      },
      "ece": {
        "OPEN": [
          31392,
          69760
        ],
        "OBC-NCL": [
          44970,
          119920
        ],
        "EWS": [
          35799,
          85918
        ],
        "SC": [
          108982,
          326947
        ],
        "ST": [
          91646,
          458230
        ]
      }
    }
  },
  {
    "slug": "iiitdm-kancheepuram",
    "name": "IIITDM Kancheepuram",
    "short": "IIITDM-K",
    "type": "IIIT",
    "nirf": 86,
    "location": "Chennai, Tamil Nadu",
    "state": "Tamil Nadu",
    "coords": {
      "lat": 12.84,
      "lng": 80.01
    },
    "estd": 2007,
    "accent": "#0ea5a4",
    "heroImage": "/assets/team/IIITs/IIIT KANCHEPURAM.jpg",
    "website": "https://iiitdm.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIITDM Kancheepuram is an Indian Institute of Information Technology located in Chennai, Tamil Nadu. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 30000,
      "mess": 38000,
      "other": 13000
    },
    "placements": {
      "avg": 1300000,
      "median": 1130000,
      "highest": 3640000,
      "placedPct": 85,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 1910000,
        "ai": 1940000,
        "ece": 1310000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          13830,
          30734
        ],
        "OBC-NCL": [
          16253,
          43342
        ],
        "EWS": [
          14060,
          33745
        ],
        "SC": [
          41766,
          125297
        ],
        "ST": [
          34567,
          172833
        ]
      },
      "ai": {
        "OPEN": [
          21170,
          47045
        ],
        "OBC-NCL": [
          28520,
          76053
        ],
        "EWS": [
          20803,
          49927
        ],
        "SC": [
          61004,
          183013
        ],
        "ST": [
          52855,
          264277
        ]
      },
      "ece": {
        "OPEN": [
          27336,
          60747
        ],
        "OBC-NCL": [
          38466,
          102576
        ],
        "EWS": [
          31256,
          75014
        ],
        "SC": [
          107497,
          322492
        ],
        "ST": [
          79902,
          399510
        ]
      }
    }
  },
  {
    "slug": "iiit-bhubaneswar",
    "name": "IIIT Bhubaneswar",
    "short": "IIIT-BBS",
    "type": "IIIT",
    "nirf": 110,
    "location": "Bhubaneswar, Odisha",
    "state": "Odisha",
    "coords": {
      "lat": 20.24,
      "lng": 85.81
    },
    "estd": 2006,
    "accent": "#d97706",
    "heroImage": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1600&q=75",
    "website": "https://iiit-bh.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIIT Bhubaneswar is an Indian Institute of Information Technology located in Bhubaneswar, Odisha. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 31000,
      "mess": 38000,
      "other": 12000
    },
    "placements": {
      "avg": 1080000,
      "median": 940000,
      "highest": 3390000,
      "placedPct": 81,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 1610000,
        "ai": 1600000,
        "ece": 1120000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          14966,
          33258
        ],
        "OBC-NCL": [
          19134,
          51025
        ],
        "EWS": [
          17552,
          42125
        ],
        "SC": [
          50377,
          151132
        ],
        "ST": [
          39961,
          199803
        ]
      },
      "ai": {
        "OPEN": [
          23914,
          53142
        ],
        "OBC-NCL": [
          36019,
          96051
        ],
        "EWS": [
          26294,
          63106
        ],
        "SC": [
          83974,
          251922
        ],
        "ST": [
          70068,
          350340
        ]
      },
      "ece": {
        "OPEN": [
          35045,
          77878
        ],
        "OBC-NCL": [
          47650,
          127065
        ],
        "EWS": [
          44344,
          106426
        ],
        "SC": [
          125276,
          375827
        ],
        "ST": [
          105377,
          526885
        ]
      }
    }
  },
  {
    "slug": "iiit-lucknow",
    "name": "IIIT Lucknow",
    "short": "IIIT-L",
    "type": "IIIT",
    "nirf": 105,
    "location": "Lucknow, Uttar Pradesh",
    "state": "Uttar Pradesh",
    "coords": {
      "lat": 26.85,
      "lng": 80.94
    },
    "estd": 2015,
    "accent": "#F15A38",
    "heroImage": "/assets/team/IIITs/IIIT LUCKNOW.jpeg",
    "website": "https://iiitl.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIIT Lucknow is an Indian Institute of Information Technology located in Lucknow, Uttar Pradesh. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 30000,
      "mess": 37000,
      "other": 13000
    },
    "placements": {
      "avg": 1140000,
      "median": 990000,
      "highest": 3200000,
      "placedPct": 83,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 1640000,
        "ai": 1660000,
        "ece": 1190000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          18432,
          40959
        ],
        "OBC-NCL": [
          23808,
          63488
        ],
        "EWS": [
          20284,
          48682
        ],
        "SC": [
          54723,
          164170
        ],
        "ST": [
          45817,
          229083
        ]
      },
      "ai": {
        "OPEN": [
          26948,
          59884
        ],
        "OBC-NCL": [
          32484,
          86624
        ],
        "EWS": [
          25575,
          61380
        ],
        "SC": [
          85092,
          255275
        ],
        "ST": [
          71426,
          357129
        ]
      },
      "ece": {
        "OPEN": [
          39502,
          87783
        ],
        "OBC-NCL": [
          47951,
          127869
        ],
        "EWS": [
          46531,
          111674
        ],
        "SC": [
          139151,
          417454
        ],
        "ST": [
          106026,
          530132
        ]
      }
    }
  },
  {
    "slug": "iiit-nagpur",
    "name": "IIIT Nagpur",
    "short": "IIIT-N",
    "type": "IIIT",
    "nirf": 120,
    "location": "Nagpur, Maharashtra",
    "state": "Maharashtra",
    "coords": {
      "lat": 21.09,
      "lng": 79.05
    },
    "estd": 2016,
    "accent": "#E0421F",
    "heroImage": "/assets/team/IIITs/IIIT NAGPUR.jpeg",
    "website": "https://iiitn.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIIT Nagpur is an Indian Institute of Information Technology located in Nagpur, Maharashtra. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 30000,
      "mess": 38000,
      "other": 13000
    },
    "placements": {
      "avg": 980000,
      "median": 850000,
      "highest": 2840000,
      "placedPct": 80,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 1460000,
        "ai": 1430000,
        "ece": 960000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          18772,
          41716
        ],
        "OBC-NCL": [
          27045,
          72120
        ],
        "EWS": [
          23709,
          56902
        ],
        "SC": [
          66917,
          200751
        ],
        "ST": [
          53524,
          267620
        ]
      },
      "ai": {
        "OPEN": [
          25790,
          57312
        ],
        "OBC-NCL": [
          35880,
          95680
        ],
        "EWS": [
          28774,
          69057
        ],
        "SC": [
          97770,
          293311
        ],
        "ST": [
          81404,
          407021
        ]
      },
      "ece": {
        "OPEN": [
          45281,
          100625
        ],
        "OBC-NCL": [
          61139,
          163037
        ],
        "EWS": [
          46403,
          111368
        ],
        "SC": [
          144559,
          433678
        ],
        "ST": [
          110886,
          554429
        ]
      }
    }
  },
  {
    "slug": "iiit-pune",
    "name": "IIIT Pune",
    "short": "IIIT-P",
    "type": "IIIT",
    "nirf": 115,
    "location": "Pune, Maharashtra",
    "state": "Maharashtra",
    "coords": {
      "lat": 18.59,
      "lng": 73.91
    },
    "estd": 2016,
    "accent": "#d97706",
    "heroImage": "/assets/team/IIITs/IIIT PUNE.jpg",
    "website": "https://iiitp.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIIT Pune is an Indian Institute of Information Technology located in Pune, Maharashtra. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 30000,
      "mess": 37000,
      "other": 11000
    },
    "placements": {
      "avg": 920000,
      "median": 800000,
      "highest": 2710000,
      "placedPct": 80,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 1460000,
        "ai": 1300000,
        "ece": 950000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          17938,
          39862
        ],
        "OBC-NCL": [
          24739,
          65969
        ],
        "EWS": [
          19050,
          45720
        ],
        "SC": [
          56206,
          168618
        ],
        "ST": [
          42983,
          214913
        ]
      },
      "ai": {
        "OPEN": [
          22917,
          50926
        ],
        "OBC-NCL": [
          29924,
          79798
        ],
        "EWS": [
          23871,
          57289
        ],
        "SC": [
          75219,
          225656
        ],
        "ST": [
          60687,
          303434
        ]
      },
      "ece": {
        "OPEN": [
          48676,
          108169
        ],
        "OBC-NCL": [
          62328,
          166208
        ],
        "EWS": [
          55963,
          134312
        ],
        "SC": [
          164838,
          494515
        ],
        "ST": [
          120367,
          601833
        ]
      }
    }
  },
  {
    "slug": "iiit-vadodara",
    "name": "IIIT Vadodara",
    "short": "IIIT-V",
    "type": "IIIT",
    "nirf": 118,
    "location": "Gandhinagar, Gujarat",
    "state": "Gujarat",
    "coords": {
      "lat": 23.22,
      "lng": 72.65
    },
    "estd": 2013,
    "accent": "#c2410c",
    "heroImage": "/assets/team/IIITs/IIIT VADODARA.jpeg",
    "website": "https://iiitvadodara.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIIT Vadodara is an Indian Institute of Information Technology located in Gandhinagar, Gujarat. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 30000,
      "mess": 35000,
      "other": 11000
    },
    "placements": {
      "avg": 1000000,
      "median": 870000,
      "highest": 2740000,
      "placedPct": 80,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 1470000,
        "ai": 1460000,
        "ece": 970000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          16927,
          37616
        ],
        "OBC-NCL": [
          22968,
          61249
        ],
        "EWS": [
          17482,
          41956
        ],
        "SC": [
          53902,
          161705
        ],
        "ST": [
          41627,
          208136
        ]
      },
      "ai": {
        "OPEN": [
          27066,
          60146
        ],
        "OBC-NCL": [
          36481,
          97282
        ],
        "EWS": [
          28024,
          67258
        ],
        "SC": [
          96283,
          288850
        ],
        "ST": [
          77014,
          385068
        ]
      },
      "ece": {
        "OPEN": [
          41688,
          92641
        ],
        "OBC-NCL": [
          62162,
          165766
        ],
        "EWS": [
          49043,
          117703
        ],
        "SC": [
          148459,
          445376
        ],
        "ST": [
          123912,
          619558
        ]
      }
    }
  },
  {
    "slug": "iiit-kota",
    "name": "IIIT Kota",
    "short": "IIIT-Kota",
    "type": "IIIT",
    "nirf": 125,
    "location": "Kota, Rajasthan",
    "state": "Rajasthan",
    "coords": {
      "lat": 25.13,
      "lng": 75.84
    },
    "estd": 2013,
    "accent": "#0ea5a4",
    "heroImage": "/assets/team/IIITs/IIIT KOTA.jpg",
    "website": "https://iiitkota.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIIT Kota is an Indian Institute of Information Technology located in Kota, Rajasthan. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 28000,
      "mess": 35000,
      "other": 12000
    },
    "placements": {
      "avg": 920000,
      "median": 800000,
      "highest": 2180000,
      "placedPct": 79,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 1390000,
        "ai": 1370000,
        "ece": 930000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          17496,
          38879
        ],
        "OBC-NCL": [
          23819,
          63517
        ],
        "EWS": [
          18483,
          44360
        ],
        "SC": [
          61474,
          184421
        ],
        "ST": [
          49577,
          247886
        ]
      },
      "ai": {
        "OPEN": [
          27755,
          61678
        ],
        "OBC-NCL": [
          39662,
          105764
        ],
        "EWS": [
          29370,
          70488
        ],
        "SC": [
          94253,
          282760
        ],
        "ST": [
          81896,
          409479
        ]
      },
      "ece": {
        "OPEN": [
          42509,
          94464
        ],
        "OBC-NCL": [
          64339,
          171572
        ],
        "EWS": [
          53553,
          128527
        ],
        "SC": [
          151489,
          454466
        ],
        "ST": [
          110868,
          554342
        ]
      }
    }
  },
  {
    "slug": "iiit-guwahati",
    "name": "IIIT Guwahati",
    "short": "IIIT-G",
    "type": "IIIT",
    "nirf": 122,
    "location": "Guwahati, Assam",
    "state": "Assam",
    "coords": {
      "lat": 26.13,
      "lng": 91.8
    },
    "estd": 2013,
    "accent": "#15803d",
    "heroImage": "/assets/team/IIITs/IIIT GUWAHATI.jpg",
    "website": "https://iiitg.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIIT Guwahati is an Indian Institute of Information Technology located in Guwahati, Assam. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 30000,
      "mess": 36000,
      "other": 12000
    },
    "placements": {
      "avg": 940000,
      "median": 820000,
      "highest": 2600000,
      "placedPct": 78,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 1410000,
        "ai": 1350000,
        "ece": 960000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          15357,
          34126
        ],
        "OBC-NCL": [
          20690,
          55174
        ],
        "EWS": [
          17610,
          42264
        ],
        "SC": [
          56501,
          169504
        ],
        "ST": [
          48615,
          243077
        ]
      },
      "ai": {
        "OPEN": [
          26300,
          58444
        ],
        "OBC-NCL": [
          36891,
          98375
        ],
        "EWS": [
          28236,
          67767
        ],
        "SC": [
          99728,
          299183
        ],
        "ST": [
          76650,
          383248
        ]
      },
      "ece": {
        "OPEN": [
          44262,
          98359
        ],
        "OBC-NCL": [
          60105,
          160281
        ],
        "EWS": [
          53391,
          128139
        ],
        "SC": [
          145135,
          435404
        ],
        "ST": [
          116129,
          580645
        ]
      }
    }
  },
  {
    "slug": "iiit-kalyani",
    "name": "IIIT Kalyani",
    "short": "IIIT-Kal",
    "type": "IIIT",
    "nirf": 130,
    "location": "Kalyani, West Bengal",
    "state": "West Bengal",
    "coords": {
      "lat": 22.97,
      "lng": 88.43
    },
    "estd": 2014,
    "accent": "#9a3412",
    "heroImage": "/assets/team/IIITs/IIIT KALYANI.webp",
    "website": "https://iiitkalyani.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIIT Kalyani is an Indian Institute of Information Technology located in Kalyani, West Bengal. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 29000,
      "mess": 37000,
      "other": 13000
    },
    "placements": {
      "avg": 860000,
      "median": 750000,
      "highest": 2330000,
      "placedPct": 78,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 1340000,
        "ai": 1290000,
        "ece": 860000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          19407,
          43126
        ],
        "OBC-NCL": [
          27124,
          72330
        ],
        "EWS": [
          20511,
          49227
        ],
        "SC": [
          59011,
          177034
        ],
        "ST": [
          48937,
          244685
        ]
      },
      "ai": {
        "OPEN": [
          27007,
          60015
        ],
        "OBC-NCL": [
          35271,
          94056
        ],
        "EWS": [
          28016,
          67239
        ],
        "SC": [
          92170,
          276509
        ],
        "ST": [
          66828,
          334140
        ]
      },
      "ece": {
        "OPEN": [
          51296,
          113992
        ],
        "OBC-NCL": [
          61771,
          164723
        ],
        "EWS": [
          52026,
          124863
        ],
        "SC": [
          150664,
          451993
        ],
        "ST": [
          133756,
          668781
        ]
      }
    }
  },
  {
    "slug": "iiit-una",
    "name": "IIIT Una",
    "short": "IIIT-Una",
    "type": "IIIT",
    "nirf": 128,
    "location": "Una, Himachal Pradesh",
    "state": "Himachal Pradesh",
    "coords": {
      "lat": 31.46,
      "lng": 76.27
    },
    "estd": 2014,
    "accent": "#fb923c",
    "heroImage": "/assets/team/IIITs/IIIT UNA.jpg",
    "website": "https://iiituna.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIIT Una is an Indian Institute of Information Technology located in Una, Himachal Pradesh. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 32000,
      "mess": 38000,
      "other": 13000
    },
    "placements": {
      "avg": 870000,
      "median": 760000,
      "highest": 2860000,
      "placedPct": 77,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 1280000,
        "ai": 1310000,
        "ece": 910000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          17734,
          39409
        ],
        "OBC-NCL": [
          21775,
          58066
        ],
        "EWS": [
          18660,
          44783
        ],
        "SC": [
          52231,
          156693
        ],
        "ST": [
          45681,
          228407
        ]
      },
      "ai": {
        "OPEN": [
          27654,
          61452
        ],
        "OBC-NCL": [
          36844,
          98251
        ],
        "EWS": [
          29668,
          71203
        ],
        "SC": [
          94250,
          282749
        ],
        "ST": [
          82502,
          412511
        ]
      },
      "ece": {
        "OPEN": [
          43890,
          97534
        ],
        "OBC-NCL": [
          67706,
          180549
        ],
        "EWS": [
          48853,
          117246
        ],
        "SC": [
          160148,
          480443
        ],
        "ST": [
          122671,
          613354
        ]
      }
    }
  },
  {
    "slug": "iiit-sonepat",
    "name": "IIIT Sonepat",
    "short": "IIIT-Son",
    "type": "IIIT",
    "nirf": 132,
    "location": "Sonepat, Haryana",
    "state": "Haryana",
    "coords": {
      "lat": 28.99,
      "lng": 77.02
    },
    "estd": 2014,
    "accent": "#f59e0b",
    "heroImage": "/assets/team/IIITs/IIIT SONEPAT.jpeg",
    "website": "https://iiitsonepat.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIIT Sonepat is an Indian Institute of Information Technology located in Sonepat, Haryana. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 29000,
      "mess": 34000,
      "other": 13000
    },
    "placements": {
      "avg": 880000,
      "median": 770000,
      "highest": 2270000,
      "placedPct": 79,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 1310000,
        "ai": 1320000,
        "ece": 930000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          17460,
          38800
        ],
        "OBC-NCL": [
          24529,
          65412
        ],
        "EWS": [
          20872,
          50093
        ],
        "SC": [
          61054,
          183162
        ],
        "ST": [
          47126,
          235631
        ]
      },
      "ai": {
        "OPEN": [
          23835,
          52967
        ],
        "OBC-NCL": [
          32613,
          86968
        ],
        "EWS": [
          29541,
          70899
        ],
        "SC": [
          89352,
          268057
        ],
        "ST": [
          67950,
          339748
        ]
      },
      "ece": {
        "OPEN": [
          45730,
          101623
        ],
        "OBC-NCL": [
          52938,
          141169
        ],
        "EWS": [
          48357,
          116058
        ],
        "SC": [
          148133,
          444400
        ],
        "ST": [
          123303,
          616517
        ]
      }
    }
  },
  {
    "slug": "iiit-sricity",
    "name": "IIIT Sri City",
    "short": "IIIT-SC",
    "type": "IIIT",
    "nirf": 124,
    "location": "Sri City, Andhra Pradesh",
    "state": "Andhra Pradesh",
    "coords": {
      "lat": 13.55,
      "lng": 80.02
    },
    "estd": 2013,
    "accent": "#0d9488",
    "heroImage": "/assets/team/IIITs/IIIT SRI CITY.jpg",
    "website": "https://iiits.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIIT Sri City is an Indian Institute of Information Technology located in Sri City, Andhra Pradesh. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 32000,
      "mess": 41000,
      "other": 11000
    },
    "placements": {
      "avg": 950000,
      "median": 830000,
      "highest": 3130000,
      "placedPct": 77,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 1480000,
        "ai": 1460000,
        "ece": 950000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          17361,
          38581
        ],
        "OBC-NCL": [
          21919,
          58451
        ],
        "EWS": [
          19480,
          46752
        ],
        "SC": [
          54539,
          163616
        ],
        "ST": [
          45155,
          225777
        ]
      },
      "ai": {
        "OPEN": [
          24928,
          55396
        ],
        "OBC-NCL": [
          30103,
          80276
        ],
        "EWS": [
          25625,
          61500
        ],
        "SC": [
          76657,
          229970
        ],
        "ST": [
          66324,
          331620
        ]
      },
      "ece": {
        "OPEN": [
          51101,
          113559
        ],
        "OBC-NCL": [
          65200,
          173867
        ],
        "EWS": [
          52713,
          126510
        ],
        "SC": [
          170396,
          511189
        ],
        "ST": [
          126324,
          631620
        ]
      }
    }
  },
  {
    "slug": "iiit-kottayam",
    "name": "IIIT Kottayam",
    "short": "IIIT-Kot",
    "type": "IIIT",
    "nirf": 119,
    "location": "Kottayam, Kerala",
    "state": "Kerala",
    "coords": {
      "lat": 9.75,
      "lng": 76.65
    },
    "estd": 2015,
    "accent": "#b45309",
    "heroImage": "/assets/team/IIITs/IIIT KOTTAYAM.jpeg",
    "website": "https://iiitkottayam.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIIT Kottayam is an Indian Institute of Information Technology located in Kottayam, Kerala. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 29000,
      "mess": 35000,
      "other": 13000
    },
    "placements": {
      "avg": 950000,
      "median": 830000,
      "highest": 2470000,
      "placedPct": 81,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 1490000,
        "ai": 1390000,
        "ece": 950000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          20903,
          46451
        ],
        "OBC-NCL": [
          24577,
          65539
        ],
        "EWS": [
          21892,
          52541
        ],
        "SC": [
          64522,
          193565
        ],
        "ST": [
          49388,
          246939
        ]
      },
      "ai": {
        "OPEN": [
          27591,
          61314
        ],
        "OBC-NCL": [
          37734,
          100625
        ],
        "EWS": [
          31174,
          74817
        ],
        "SC": [
          91364,
          274093
        ],
        "ST": [
          73692,
          368461
        ]
      },
      "ece": {
        "OPEN": [
          43037,
          95638
        ],
        "OBC-NCL": [
          59800,
          159465
        ],
        "EWS": [
          51435,
          123445
        ],
        "SC": [
          158746,
          476237
        ],
        "ST": [
          116006,
          580028
        ]
      }
    }
  },
  {
    "slug": "iiit-dharwad",
    "name": "IIIT Dharwad",
    "short": "IIIT-Dwd",
    "type": "IIIT",
    "nirf": 126,
    "location": "Dharwad, Karnataka",
    "state": "Karnataka",
    "coords": {
      "lat": 15.39,
      "lng": 75.02
    },
    "estd": 2015,
    "accent": "#e8590c",
    "heroImage": "/assets/team/IIITs/IIIT DHARWAD.jpg",
    "website": "https://iiitdwd.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIIT Dharwad is an Indian Institute of Information Technology located in Dharwad, Karnataka. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 29000,
      "mess": 36000,
      "other": 11000
    },
    "placements": {
      "avg": 930000,
      "median": 810000,
      "highest": 2370000,
      "placedPct": 79,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 1440000,
        "ai": 1400000,
        "ece": 900000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          17916,
          39813
        ],
        "OBC-NCL": [
          25285,
          67426
        ],
        "EWS": [
          20822,
          49972
        ],
        "SC": [
          63948,
          191844
        ],
        "ST": [
          48760,
          243802
        ]
      },
      "ai": {
        "OPEN": [
          31551,
          70112
        ],
        "OBC-NCL": [
          40505,
          108012
        ],
        "EWS": [
          35200,
          84481
        ],
        "SC": [
          103613,
          310838
        ],
        "ST": [
          80248,
          401242
        ]
      },
      "ece": {
        "OPEN": [
          39179,
          87065
        ],
        "OBC-NCL": [
          56960,
          151892
        ],
        "EWS": [
          48807,
          117138
        ],
        "SC": [
          142740,
          428220
        ],
        "ST": [
          105122,
          525608
        ]
      }
    }
  },
  {
    "slug": "iiit-ranchi",
    "name": "IIIT Ranchi",
    "short": "IIIT-R",
    "type": "IIIT",
    "nirf": 135,
    "location": "Ranchi, Jharkhand",
    "state": "Jharkhand",
    "coords": {
      "lat": 23.34,
      "lng": 85.31
    },
    "estd": 2016,
    "accent": "#a16207",
    "heroImage": "/assets/team/IIITs/IIIT RANCHI.jpeg",
    "website": "https://iiitranchi.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIIT Ranchi is an Indian Institute of Information Technology located in Ranchi, Jharkhand. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 33000,
      "mess": 34000,
      "other": 12000
    },
    "placements": {
      "avg": 850000,
      "median": 740000,
      "highest": 2970000,
      "placedPct": 76,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 1310000,
        "ai": 1270000,
        "ece": 840000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          22437,
          49860
        ],
        "OBC-NCL": [
          31360,
          83626
        ],
        "EWS": [
          25702,
          61684
        ],
        "SC": [
          78582,
          235747
        ],
        "ST": [
          62855,
          314277
        ]
      },
      "ai": {
        "OPEN": [
          27461,
          61024
        ],
        "OBC-NCL": [
          35314,
          94171
        ],
        "EWS": [
          29638,
          71130
        ],
        "SC": [
          94335,
          283005
        ],
        "ST": [
          78519,
          392593
        ]
      },
      "ece": {
        "OPEN": [
          44471,
          98824
        ],
        "OBC-NCL": [
          55934,
          149157
        ],
        "EWS": [
          53895,
          129348
        ],
        "SC": [
          143272,
          429816
        ],
        "ST": [
          131269,
          656343
        ]
      }
    }
  },
  {
    "slug": "iiit-surat",
    "name": "IIIT Surat",
    "short": "IIIT-Sur",
    "type": "IIIT",
    "nirf": 121,
    "location": "Surat, Gujarat",
    "state": "Gujarat",
    "coords": {
      "lat": 21.16,
      "lng": 72.78
    },
    "estd": 2017,
    "accent": "#047857",
    "heroImage": "/assets/team/IIITs/IIIT SURAT.png",
    "website": "https://iiitsurat.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIIT Surat is an Indian Institute of Information Technology located in Surat, Gujarat. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 31000,
      "mess": 39000,
      "other": 13000
    },
    "placements": {
      "avg": 880000,
      "median": 770000,
      "highest": 2700000,
      "placedPct": 80,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 1300000,
        "ai": 1340000,
        "ece": 850000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          19407,
          43127
        ],
        "OBC-NCL": [
          26669,
          71116
        ],
        "EWS": [
          21471,
          51530
        ],
        "SC": [
          65198,
          195594
        ],
        "ST": [
          54468,
          272338
        ]
      },
      "ai": {
        "OPEN": [
          25946,
          57659
        ],
        "OBC-NCL": [
          33231,
          88617
        ],
        "EWS": [
          27567,
          66161
        ],
        "SC": [
          79579,
          238736
        ],
        "ST": [
          67103,
          335513
        ]
      },
      "ece": {
        "OPEN": [
          47073,
          104608
        ],
        "OBC-NCL": [
          64153,
          171075
        ],
        "EWS": [
          51997,
          124793
        ],
        "SC": [
          138238,
          414714
        ],
        "ST": [
          125634,
          628171
        ]
      }
    }
  },
  {
    "slug": "iiit-bhagalpur",
    "name": "IIIT Bhagalpur",
    "short": "IIIT-Bhg",
    "type": "IIIT",
    "nirf": 138,
    "location": "Bhagalpur, Bihar",
    "state": "Bihar",
    "coords": {
      "lat": 25.24,
      "lng": 86.99
    },
    "estd": 2017,
    "accent": "#dc6803",
    "heroImage": "/assets/team/IIITs/IIIT BHAGALPUR.avif",
    "website": "https://iiitbh.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIIT Bhagalpur is an Indian Institute of Information Technology located in Bhagalpur, Bihar. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 30000,
      "mess": 36000,
      "other": 12000
    },
    "placements": {
      "avg": 870000,
      "median": 760000,
      "highest": 2500000,
      "placedPct": 76,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 1370000,
        "ai": 1250000,
        "ece": 920000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          22503,
          50006
        ],
        "OBC-NCL": [
          30877,
          82339
        ],
        "EWS": [
          26147,
          62754
        ],
        "SC": [
          72877,
          218631
        ],
        "ST": [
          61301,
          306507
        ]
      },
      "ai": {
        "OPEN": [
          31895,
          70878
        ],
        "OBC-NCL": [
          43209,
          115224
        ],
        "EWS": [
          33690,
          80856
        ],
        "SC": [
          98938,
          296813
        ],
        "ST": [
          89756,
          448779
        ]
      },
      "ece": {
        "OPEN": [
          57489,
          127753
        ],
        "OBC-NCL": [
          69200,
          184534
        ],
        "EWS": [
          55956,
          134295
        ],
        "SC": [
          170647,
          511941
        ],
        "ST": [
          135289,
          676443
        ]
      }
    }
  },
  {
    "slug": "iiit-trichy",
    "name": "IIIT Tiruchirappalli",
    "short": "IIIT-T",
    "type": "IIIT",
    "nirf": 117,
    "location": "Tiruchirappalli, Tamil Nadu",
    "state": "Tamil Nadu",
    "coords": {
      "lat": 10.76,
      "lng": 78.81
    },
    "estd": 2013,
    "accent": "#ca8a04",
    "heroImage": "/assets/team/IIITs/IIIT TRICHY.jpg",
    "website": "https://iiitt.ac.in",
    "counsellingExam": "JEE Main (JoSAA + CSAB)",
    "about": "IIIT Tiruchirappalli is an Indian Institute of Information Technology located in Tiruchirappalli, Tamil Nadu. It offers competitive engineering programmes with strong placements. (Illustrative profile — replace fees, placement and cutoff figures with official data.)",
    "fees": {
      "tuition": 200000,
      "hostel": 29000,
      "mess": 37000,
      "other": 13000
    },
    "placements": {
      "avg": 910000,
      "median": 790000,
      "highest": 2450000,
      "placedPct": 81,
      "recruiters": [
        "Amazon",
        "Microsoft",
        "Sprinklr",
        "D. E. Shaw",
        "Oracle",
        "Walmart"
      ],
      "byBranch": {
        "cse": 1380000,
        "ai": 1330000,
        "ece": 930000
      }
    },
    "baseCutoff": {
      "cse": {
        "OPEN": [
          17063,
          37918
        ],
        "OBC-NCL": [
          21019,
          56051
        ],
        "EWS": [
          19916,
          47798
        ],
        "SC": [
          55865,
          167594
        ],
        "ST": [
          44684,
          223419
        ]
      },
      "ai": {
        "OPEN": [
          23451,
          52113
        ],
        "OBC-NCL": [
          35527,
          94739
        ],
        "EWS": [
          26863,
          64471
        ],
        "SC": [
          78492,
          235475
        ],
        "ST": [
          62101,
          310505
        ]
      },
      "ece": {
        "OPEN": [
          43473,
          96607
        ],
        "OBC-NCL": [
          52818,
          140849
        ],
        "EWS": [
          46320,
          111167
        ],
        "SC": [
          133413,
          400239
        ],
        "ST": [
          122189,
          610943
        ]
      }
    }
  }
];

export const COLLEGE_BY_SLUG = Object.fromEntries(COLLEGES.map((c) => [c.slug, c]));
export const STATES = [...new Set(COLLEGES.map((c) => c.state))].sort();
