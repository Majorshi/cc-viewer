# TeamCreate

共有タスクリストとエージェント間メッセージングチャンネルを持つ新しい協業チームを確立します。チームはマルチエージェント作業の調整プリミティブです — メインセッションがリーダーとして動作し、`Agent` ツールを介して名前付きチームメイトを起動します。

## 使用タイミング

- ユーザーがチーム、swarm、crew、またはマルチエージェント協業を明示的に要求した場合。
- プロジェクトに、専門の専任スペシャリスト (例えばフロントエンド、バックエンド、テスト、ドキュメント) から恩恵を受ける、明らかに独立した複数のワークストリームがある場合。
- 複数のエージェントが進捗するにつれて更新する永続的な共有タスクリストが必要な場合。
- 一度限りのサブエージェント呼び出しではなく、`SendMessage` を介してメッセージを交換できる、名前付きでアドレス指定可能なチームメイトが必要な場合。

単一の委任された検索や一度限りの並列ファンアウトには使用しないでください — プレーンな `Agent` 呼び出しの方が軽量で十分です。

## パラメータ

- `team_name` (string, required): チームの一意な識別子。`~/.claude/teams/` の下のディレクトリ名として、またチームメイトを起動するときの `team_name` 引数として使用されます。
- `description` (string, required): チームの目的に関する短いステートメント。起動時にすべてのチームメイトに表示され、チーム設定に書き込まれます。
- `agent_type` (string, optional): オーバーライドしないチームメイトに適用されるデフォルトのサブエージェントペルソナ。典型的な値は `general-purpose`、`Explore`、`Plan`。

## 例

### 例 1: リファクタリングチームを作成

```
TeamCreate(
  team_name="refactor-crew",
  description="Refactor the data access layer from raw SQL to Prisma, including migrations and tests.",
  agent_type="general-purpose"
)
```

作成後、`team_name: "refactor-crew"` と `db-lead`、`migrations`、`tests` などの異なる `name` 値を使用して、`Agent` でチームメイトを起動します。

### 例 2: 調査チームを作成

```
TeamCreate(
  team_name="perf-investigation",
  description="Identify and rank the top three performance regressions introduced in the last release.",
  agent_type="Explore"
)
```

起動された各チームメイトは、デフォルトペルソナとして `Explore` を継承し、作業の読み取り専用調査的な性質に一致します。

## 注意事項

- 特定のセッションから一度にリードできるのは 1 つのチームだけです。別のチームを作成する前に現在のチームを終了または削除してください。
- チームは共有タスクリストと 1:1 です。リーダーがタスクの作成、割り当て、クローズを所有し、チームメイトは取り組んでいるタスクのステータスを更新します。
- チーム設定は `~/.claude/teams/{team_name}/config.json` に永続化され、タスクディレクトリはその隣にあります。これらのファイルは `TeamDelete` で明示的に削除されるまでセッションをまたいで存続します。
- チームメイトは、一致する `team_name` と異なる `name` を使用して `Agent` ツールで起動されます。`name` は `SendMessage` で使用されるアドレスになります。
- ファイルシステムに安全な `team_name` (文字、数字、ダッシュ、アンダースコア) を選んでください。スペースやスラッシュは避けてください。
- まったく新しいチームメイトがコールドで読んだとき、それ以上のコンテキストなしにチームの目標を理解できるように `description` を書いてください。これは各チームメイトの起動プロンプトの一部になります。
