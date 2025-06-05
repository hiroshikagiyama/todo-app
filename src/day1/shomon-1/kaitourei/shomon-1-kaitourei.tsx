// * 関数名
// f, greet, checkAllUserLogin など曖昧
// -> isLoginAllowed, createGreeting, getAllLoginMessages で具体的に
// * 変数名
// u, notU, result など意味不明・誤解を生む
// -> user, blacklistedUsernames, loginAllowed, greeting で明確に
// * ロジックの可読性
// ネストした if や否定が混じった条件式
// -> isOldEnough && isNotBlacklisted に分割し、意図が明確な条件式 に整理
// * 順序と整形
// 空行やインデントの乱れが可読性を下げていた
// -> 整形と余白で視認性を改善
// * コメント
// コメントがなく意図が読めなかった
// -> 関数ごとに「なぜその関数があるか」を書いた
// * 評価順序（左=対象）
// -> 20 <= u.age（期待値→評価対象の逆順）

// 各ユーザーの年齢を判定し、20歳以上なら「ようこそ」と表示するプログラム

export type User = {
  age: number;
  name: string;
};

const blacklistedUsernames = ["octocat", "saburo", "hanakomachi"];


export function isLoginAllowed(user: User): boolean {
  const isOldEnough = user.age >= 20;
  const isNotBlacklisted = !blacklistedUsernames.includes(user.name);

  return isOldEnough && isNotBlacklisted;
}

export function createGreeting(name: string): string {
  if (name === "") return "";
  return `Hello, ${name}`;
}

export function getAllLoginMessages(users: User[]): string[] {
  return users.map((user) => {
    const loginAllowed = isLoginAllowed(user);
    const greeting = createGreeting(user.name);
    return loginAllowed ? `${greeting}, welcome!` : `${greeting}, you are not allowed.`;
  });
}
