from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseModelProvider(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @property
    @abstractmethod
    def version(self) -> str:
        pass

    @property
    @abstractmethod
    def is_mock(self) -> bool:
        pass

    @abstractmethod
    async def analyze_text(self, text: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Extract features, assess AI likelihood vs Human-like likelihood,
        calculate confidence, extract sentence-level insights, and generate evidence.
        """
        pass

    @abstractmethod
    async def analyze_image(self, image_bytes: bytes, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Perform EXIF analysis, compression/ELA forensics, and AI generation indicator checks.
        """
        pass

    @abstractmethod
    async def analyze_audio(self, audio_bytes: bytes, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Analyze audio spectral characteristics, synthetic speech indicators, and integrity.
        """
        pass

    @abstractmethod
    async def analyze_video(self, video_bytes: bytes, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Perform frame extraction, temporal consistency, and deepfake artifact checks.
        """
        pass
