"""
Setup script for Advanced LEO Search Tool
"""

from setuptools import setup, find_packages
import os

# Read the README file
def read_readme():
    with open("README.md", "r", encoding="utf-8") as fh:
        return fh.read()

# Read requirements
def read_requirements():
    with open("requirements.txt", "r", encoding="utf-8") as fh:
        return [line.strip() for line in fh if line.strip() and not line.startswith("#")]

setup(
    name="leo-search-tool",
    version="1.0.0",
    author="LEO Search Tool Team",
    author_email="team@leosearchtool.com",
    description="Advanced LEO Search Tool for Realtor Companies",
    long_description=read_readme(),
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/leo-search-tool",
    project_urls={
        "Bug Reports": "https://github.com/yourusername/leo-search-tool/issues",
        "Source": "https://github.com/yourusername/leo-search-tool",
        "Documentation": "https://leosearchtool.readthedocs.io/",
    },
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Legal Industry",
        "Intended Audience :: Real Estate Industry",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Topic :: Internet :: WWW/HTTP :: HTTP Servers",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: Text Processing :: Linguistic",
        "Topic :: Database :: Database Engines/Servers",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Topic :: Security",
        "Topic :: System :: Monitoring",
    ],
    python_requires=">=3.9",
    install_requires=read_requirements(),
    extras_require={
        "dev": [
            "pytest>=7.4.0",
            "pytest-asyncio>=0.21.0",
            "pytest-cov>=4.1.0",
            "pytest-mock>=3.11.0",
            "black>=23.0.0",
            "isort>=5.12.0",
            "flake8>=6.0.0",
            "mypy>=1.5.0",
            "pre-commit>=3.3.0",
            "httpx>=0.25.0",
            "factory-boy>=3.3.0",
            "faker>=19.0.0",
        ],
        "monitoring": [
            "prometheus-client>=0.17.0",
            "sentry-sdk[fastapi]>=1.38.0",
            "opentelemetry-api>=1.20.0",
            "opentelemetry-sdk>=1.20.0",
            "opentelemetry-instrumentation-fastapi>=0.41b0",
        ],
        "production": [
            "gunicorn>=21.2.0",
            "uvicorn[standard]>=0.24.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "leo-search=src.cli.main:main",
            "leo-search-worker=src.core.celery_app:worker_main",
            "leo-search-beat=src.core.celery_app:beat_main",
        ],
    },
    include_package_data=True,
    package_data={
        "": ["*.yml", "*.yaml", "*.json", "*.sql", "*.md", "*.txt"],
    },
    zip_safe=False,
    keywords=[
        "leo", "search", "law-enforcement", "realtor", "background-check",
        "criminal-records", "property-records", "people-search", "fastapi",
        "elasticsearch", "postgresql", "redis", "ai", "machine-learning"
    ],
)
