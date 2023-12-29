import datetime
from sqlalchemy import (
    Boolean,
    Integer,
    Column,
    String,
    ForeignKey,
    DateTime,
    Date,
    Time,
)
from sqlalchemy.orm import declarative_base, relationship
from config import IP_SERVER


Base = declarative_base()


class ComplexServices(Base):
    __tablename__ = "complex_services"

    complex_id = Column(
        Integer,
        ForeignKey("complexes.id", onupdate="CASCADE", ondelete="CASCADE"),
        primary_key=True,
    )
    service_id = Column(
        Integer,
        ForeignKey("services.id", onupdate="CASCADE", ondelete="CASCADE"),
        primary_key=True,
    )


class UserServices(Base):
    __tablename__ = "user_services"

    service_id = Column(
        Integer,
        ForeignKey("services.id", onupdate="CASCADE", ondelete="CASCADE"),
        primary_key=True,
    )
    user_id = Column(
        Integer,
        ForeignKey("users.id", onupdate="CASCADE", ondelete="CASCADE"),
        primary_key=True,
    )


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, autoincrement=True)
    phone = Column(String, nullable=False)
    auth_code = Column(String, nullable=False)
    name = Column(String, nullable=True)
    birthday = Column(Date, nullable=True)
    email = Column(String, nullable=True)
    instagram = Column(String, nullable=True)
    telegram = Column(String, nullable=True)
    registered_at = Column(
        DateTime(timezone=True), default=datetime.datetime.now, nullable=False
    )
    communication = Column(Boolean, server_default="True", nullable=False)
    came_from = Column(String, nullable=True)
    image = Column(
        String, default=f"http://{IP_SERVER}:8000/static/defaultLogo.jpg", nullable=True
    )

    user_id = Column(
        Integer, ForeignKey("users.id", onupdate="CASCADE", ondelete="CASCADE")
    )
    registered_by = relationship("User", back_populates="clients")

    records = relationship("Record", back_populates="client", lazy="selectin")

    comments = relationship("Comment", back_populates="client")

    def __str__(self) -> str:
        return f"{self.phone}"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    phone = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=True)
    birthday = Column(Date, nullable=True)
    registered_at = Column(
        DateTime(timezone=True), default=datetime.datetime.now, nullable=False
    )
    experience = Column(Integer, nullable=False, default=0)
    position = Column(String, nullable=True)
    image = Column(
        String, default=f"http://{IP_SERVER}:8000/static/defaultLogo.jpg", nullable=True
    )
    is_admin = Column(Boolean, default=False, nullable=False)
    is_staff = Column(Boolean, default=False, nullable=False)

    records = relationship("Record", back_populates="user", lazy="selectin")

    clients = relationship("Client", back_populates="registered_by")
    relationship("Record", back_populates="user", lazy="selectin")
    services = relationship(
        "Service",
        lazy="selectin",
        secondary="user_services",
        back_populates="users",
        passive_deletes=True,
    )

    comments = relationship("Comment", back_populates="user")

    def __str__(self) -> str:
        return f"{self.name}"


class Record(Base):
    __tablename__ = "records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)
    status = Column(String, default="Created", nullable=False)
    price = Column(Integer, default=0, nullable=True)
    comment = Column(String, default="", nullable=True)
    image = Column(String, nullable=True)
    author = Column(String, default="", nullable=True)
    created_at = Column(
        DateTime(timezone=True), default=datetime.datetime.now, nullable=True
    )

    client_id = Column(
        Integer, ForeignKey("clients.id", onupdate="CASCADE", ondelete="CASCADE")
    )
    client = relationship("Client", lazy="selectin", back_populates="records")
    service_id = Column(
        Integer, ForeignKey("services.id", onupdate="CASCADE", ondelete="CASCADE")
    )
    service = relationship("Service", lazy="selectin", back_populates="records")

    user_id = Column(
        Integer, ForeignKey("users.id", onupdate="CASCADE", ondelete="CASCADE")
    )
    user = relationship("User", lazy="selectin", back_populates="records")

    comments = relationship("Comment", back_populates="record", lazy="selectin")

    def __str__(self) -> str:
        return self.service.name


class Complex(Base):
    __tablename__ = "complexes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    en_name = Column(String, nullable=True)
    sr_name = Column(String, nullable=True)
    services = relationship(
        "Service",
        secondary="complex_services",
        lazy="selectin",
        backref="complex",
        passive_deletes=True,
    )

    def __str__(self) -> str:
        return self.name


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    en_name = Column(String, nullable=True)
    sr_name = Column(String, nullable=True)
    price = Column(Integer, nullable=False)
    duration = Column(Integer, nullable=False)

    users = relationship(
        "User",
        lazy="selectin",
        secondary="user_services",
        back_populates="services",
        passive_deletes=True,
    )

    records = relationship("Record", back_populates="service", lazy="selectin")
    complexes = relationship(
        "Complex", secondary="complex_services", back_populates="services"
    )

    def __str__(self) -> str:
        return self.name


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(String, nullable=False)
    created_at = Column(
        DateTime(timezone=True), default=datetime.datetime.now, nullable=False
    )
    rating = Column(Integer, nullable=False)
    image = Column(
        String, default=f"http://{IP_SERVER}:8000/static/defaultLogo.jpg", nullable=True
    )

    client_id = Column(
        Integer,
        ForeignKey("clients.id", onupdate="CASCADE", ondelete="CASCADE"),
        nullable=True,
    )
    client = relationship("Client", back_populates="comments", lazy="selectin")

    user_id = Column(
        Integer,
        ForeignKey("users.id", onupdate="CASCADE", ondelete="CASCADE"),
        nullable=True,
    )
    user = relationship("User", back_populates="comments", lazy="selectin")

    record_id = Column(
        Integer,
        ForeignKey("records.id", onupdate="CASCADE", ondelete="CASCADE"),
        nullable=True,
    )
    record = relationship("Record", back_populates="comments", lazy="selectin")
