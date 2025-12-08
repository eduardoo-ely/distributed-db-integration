#!/usr/bin/env python3
"""
Script para baixar e processar o dataset Netflix Userbase do Kaggle
Requer: pip install kagglehub pandas
"""

import kagglehub
import pandas as pd
import json
import hashlib
import random
from pathlib import Path

def generate_password_hash(user_id):
    """Gera um hash MD5 simples para senha (apenas para exemplo)"""
    return hashlib.md5(f"password_{user_id}".encode()).hexdigest()

def generate_user_id(index):
    """Gera um ID único para o usuário"""
    return f"user_{index:06d}"

def process_dataset():
    print("="*60)
    print("📥 BAIXANDO DATASET DO KAGGLE")
    print("="*60)

    # Baixar dataset
    print("\n🔄 Baixando Netflix Userbase Dataset...")
    path = kagglehub.dataset_download("riturajsingh99/netflix-userbase")
    print(f"✅ Dataset baixado em: {path}")

    # Localizar o arquivo CSV
    csv_files = list(Path(path).glob("*.csv"))
    if not csv_files:
        print("❌ Nenhum arquivo CSV encontrado!")
        return

    csv_path = csv_files[0]
    print(f"\n📄 Processando arquivo: {csv_path.name}")

    # Ler CSV
    df = pd.read_csv(csv_path)
    print(f"✅ {len(df)} registros carregados")

    # Processar dados
    print("\n🔄 Processando dados...")
    users = []

    for idx, row in df.iterrows():
        user_id = generate_user_id(idx)

        # Criar email baseado no user_id
        email = f"{user_id}@netflix.com"

        # Processar gêneros (pode vir como string separada por vírgula)
        genres = []
        if pd.notna(row.get('Genres')):
            genres = [g.strip() for g in str(row['Genres']).split(',')]

        user = {
            "userId": user_id,
            "credentials": {
                "userId": user_id,
                "email": email,
                "passwordHash": generate_password_hash(user_id)
            },
            "profile": {
                "userId": user_id,
                "age": int(row['Age']) if pd.notna(row.get('Age')) else None,
                "country": str(row['Country']) if pd.notna(row.get('Country')) else None,
                "subscriptionType": str(row['Subscription Type']) if pd.notna(row.get('Subscription Type')) else None,
                "device": str(row['Device']) if pd.notna(row.get('Device')) else None,
                "genres": genres,
                "gender": str(row['Gender']) if pd.notna(row.get('Gender')) else None,
                "monthlyRevenue": float(row['Monthly Revenue']) if pd.notna(row.get('Monthly Revenue')) else None
            },
            "loginCount": random.randint(0, 100)
        }

        users.append(user)

    # Salvar como JSON
    output_file = "netflix_userbase.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(users, f, indent=2, ensure_ascii=False)

    print(f"✅ Dados processados e salvos em: {output_file}")

    # Estatísticas
    print("\n" + "="*60)
    print("📊 ESTATÍSTICAS DO DATASET")
    print("="*60)
    print(f"Total de usuários: {len(users)}")
    print(f"Países únicos: {df['Country'].nunique()}")
    print(f"Tipos de assinatura: {df['Subscription Type'].unique().tolist()}")
    print(f"Dispositivos: {df['Device'].unique().tolist()}")

    # Criar arquivo de relacionamentos para Neo4j
    create_relationships_file(users)

    print("\n✅ Processamento concluído!")
    print(f"📁 Arquivos gerados:")
    print(f"   - {output_file} (dados principais)")
    print(f"   - relationships.json (relações de follow)")

def create_relationships_file(users):
    """Cria arquivo com relacionamentos aleatórios entre usuários"""
    relationships = []
    user_ids = [u['userId'] for u in users]

    # Criar relacionamentos aleatórios (cada usuário segue de 0 a 10 outros)
    for user_id in user_ids:
        num_following = random.randint(0, min(10, len(user_ids) - 1))
        following = random.sample([uid for uid in user_ids if uid != user_id], num_following)

        for followed_id in following:
            relationships.append({
                "followerId": user_id,
                "followedId": followed_id
            })

    with open("relationships.json", 'w', encoding='utf-8') as f:
        json.dump(relationships, f, indent=2)

    print(f"✅ {len(relationships)} relacionamentos gerados")

if __name__ == "__main__":
    try:
        process_dataset()
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        import traceback
        traceback.print_exc()