$env:VERCEL_TOKEN = (vercel whoami 2>&1)

$vars = @{
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"     = "crype-1b08c.firebaseapp.com"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID"      = "crype-1b08c"
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"  = "crype-1b08c.firebasestorage.app"
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" = "355943856127"
    "NEXT_PUBLIC_FIREBASE_APP_ID"          = "1:355943856127:web:cde19a71aff1b65ccc99ca"
    "FIREBASE_PROJECT_ID"                  = "crype-1b08c"
    "FIREBASE_CLIENT_EMAIL"                = "firebase-adminsdk-fbsvc@crype-1b08c.iam.gserviceaccount.com"
}

foreach ($key in $vars.Keys) {
    $value = $vars[$key]
    Write-Host "Adding $key..."
    $value | vercel env add $key production 2>&1
    Write-Host "Done: $key"
}

$privateKey = @"
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCopSLjnluWGGZ2
cEvCs+HgKi4z5ZRLuppAz2oj9cIrEVrU71eWd/pyxUSiJG2WQe2//6NeZEOx/9Vx
FVbKUrrSwrZPJ4XwVZDPEoA29wU5wlWCeYSJXhUJlp/geZCmRC+dZ5V9D586s7Sk
B0m/ECln8/KP98AUdXopco2TOwdWDwdn7i2NcFUAutah6kmYuT91f06BPiNgP+vj
MWKRx8fa8XP+BqBl+yYbe1NvlxH4A8MOjKPBjj3C9kSxAd+LR+CPUal6IlUQlU/j
hF4ldejNVTOL7TTKHZua0cXQ+WdAqksww0W3NPJWtMAWnmFErVdN9xpgwk6Z6wra
Zfc2zbmDAgMBAAECggEAQB/2ibVDnultQHjHneOXLgzr34jaoAb2s1EKy1ydtZGW
R6QwWkMJpI1U4RBX6QvtkpVqMbCPOwYLy0FxbGITrqMh/iwJlk56zvn6bav0vTcj
G4cIOdFfz3MKHKksssP3lPL3mQORKJl/ROWOiYtkKyZLo6lxTHY0+sCXi5Wk3vge
qoZ7eGJoGQhTYO56iZzAovkJoVejx5k8VmBFeCFQxsS4vtVLR+0fDyXMrawaunr5
KyWBjlm5JQAhEhOtDxhkHranCzYJA7qiZnDxUU6LS3Pr4e+CKUhSH5wYaCbpjAIs
CFhmbSd4clPGxA+qDYJbM+dVv58Z7o7K0i1FXdYEnQKBgQDc1h/2QQcKuKU5h5ba
uIMw1Jk0uMY8F/k5BC1w0D0pE69JcVbSid6E55fijnqF8N5OThxG60mH/P/tx8C8
czviObXvErQy7l1gQv8UYHGtmWZZSxa0iDX7RrxMbCgaNDLzznWRsATyFwcBvh6m
2UHM7z4JWcAALTE+uXZTSU4UnwKBgQDDf43LJ7eU3BBUP6eUiTc7GS3shBfWsFjx
wbSHqBuIgrYbqH2MDFb9wAZkSOsG0OcCdmTW3LJMVU9cMczmo6NRofHcMY6vuDwY
Zm2R8hih7wYsk/vzVV9ZhvBCgeHJh0YBJC2CfvEdAAJM4EYYVZXo3pDceyR/7yaG
FPzQq8hsnQKBgQCc2akR6tXpk4Qm/Fr1NqBXimjWvXZvMEffa0wrGHyYNFcHvux/
1VSq6SND0xbLE22SCIClDnDHmbbdWEdYkjAyWfMSvyImGo9P08YA3w9e0dmUCnUx
/Jz6wB712MwS8IhQCpAOzgp1OE3Nuw9iSmUl/bb+RTTN60tS1b9pIGPI2QKBgCpq
Y04/iMIgWN6ejPJaLwSAewlEw5NN4Y5aU5vXKloc2fv4O30GNF2LqxdZBr0M2AId
w9UmPvz2yWgcWfN0b3vHohz/F5EibM9ycbVnjFad8H39gX2S+UQIVdpoKZ+63MJk
ogcdGZ0MInOheTPQZd0HZPChOxMSxQ30QcHYc3y1AoGBAIEZOrmXA7Y4fHWEQVDa
n/I/1mGaiAGhYCA6yAG2C0c91lJp1dx1vZMUtnCRyH8SBI4C+uHZwKy0hT+FwY/R
y251VR4FwHyTtrm5RIOVa5hlJL9/hjAjzRd+uCnSFwNStk2uyA60NU//Pcr1EM2J
jta8YRlVf8NQN5NWRbcvErgm
-----END PRIVATE KEY-----
"@

Write-Host "Adding FIREBASE_PRIVATE_KEY..."
$privateKey | vercel env add FIREBASE_PRIVATE_KEY production 2>&1
Write-Host "All done!"
