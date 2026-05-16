from __future__ import annotations

from abc import ABC, abstractmethod


class AbstractStore(ABC):

    @abstractmethod
    async def save_startup(self, startup_id: str, data: dict) -> None: ...

    @abstractmethod
    async def get_startup(self, startup_id: str) -> dict | None: ...

    @abstractmethod
    async def get_all_startups(self) -> list[dict]: ...

    @abstractmethod
    async def save_linkage(self, linkage: dict) -> None: ...

    @abstractmethod
    async def get_linkage(self, linkage_id: str) -> dict | None: ...

    @abstractmethod
    async def get_all_linkages(self) -> list[dict]: ...

    @abstractmethod
    async def update_linkage(self, linkage_id: str, updates: dict) -> dict | None: ...

    @abstractmethod
    async def save_partner(self, partner_id: str, data: dict) -> None: ...
