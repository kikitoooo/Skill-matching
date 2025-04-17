import os
import torch
import json
from transformers import BertTokenizer, BertModel
from django.conf import settings
from torch import nn

class CompetencyClassifier(nn.Module):
    """Архитектура модели (должна быть идентичной обученной модели)"""
    def __init__(self, n_classes):
        super().__init__()
        self.bert = BertModel.from_pretrained('bert-base-multilingual-cased')
        self.drop = nn.Dropout(p=0.5)
        self.hidden = nn.Linear(self.bert.config.hidden_size, 256)
        self.classifier = nn.Linear(256, n_classes)
        self.level_predictor = nn.Linear(256, n_classes)

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        pooled_output = outputs.pooler_output
        output = self.drop(pooled_output)
        hidden = torch.relu(self.hidden(output))
        return torch.sigmoid(self.classifier(hidden)), torch.sigmoid(self.level_predictor(hidden))

class SkillExtractor:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.load_model()

    def load_model(self):
        """Загрузка обученной модели и артефактов"""
        artifacts_path = os.path.join(settings.BASE_DIR, 'model_artifacts')

        with open(os.path.join(artifacts_path, 'label_columns.json'), 'r', encoding='utf-8') as f:
            self.label_columns = json.load(f)

        with open(os.path.join(artifacts_path, 'config.json'), 'r', encoding='utf-8') as f:
            self.config = json.load(f)

        self.tokenizer = BertTokenizer.from_pretrained(os.path.join(artifacts_path, 'tokenizer'))

        self.model = CompetencyClassifier(n_classes=len(self.label_columns))
        self.model.load_state_dict(torch.load(
            os.path.join(artifacts_path, 'model_weights.pth'),
            map_location=self.device
        ))
        self.model = self.model.to(self.device)
        self.model.eval()

    def extract_skills(self, text):
        """Извлечение навыков из текста"""
        encoding = self.tokenizer.encode_plus(
            text,
            max_length=self.config['max_len'],
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )
        with torch.no_grad():
            presence_pred, level_pred = self.model(
                input_ids=encoding['input_ids'].to(self.device),
                attention_mask=encoding['attention_mask'].to(self.device)
            )
        skills = {}
        for i, skill in enumerate(self.label_columns):
            if presence_pred[0][i] > 0.1:
                skills[skill] = int(round(level_pred[0][i].item() * 3))

        return skills

skill_extractor = SkillExtractor()
