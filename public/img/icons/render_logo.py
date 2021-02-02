from pathlib import Path
from typing import Tuple, List
import multiprocessing
import subprocess

SOURCE_FILE = Path("logo.svg")


def export(mp_in: Tuple[str, int]) -> str:
    name, size = mp_in
    print(f"{name}")
    result = subprocess.run(
        [
            "inkscape",
            "--export-width",
            str(size),
            "--export-height",
            str(size),
            "--export-filename",
            name,
            SOURCE_FILE,
        ],
        stderr=subprocess.PIPE,
        text=True,
    )
    return result.stderr


def main() -> None:
    fileroot: List[Tuple[str, List[int]]] = [
        ("android-chrome", [192, 512]),
        ("android-chrome-maskable", [192, 512]),
        ("apple-touch-icon", [120, 152, 180, 60, 76]),
        ("favicon", [16, 32]),
        ("msapplication-icon", [144]),
        ("mstile", [150]),
    ]

    def generateOutputName(name: str, size: int, extension: str = "png") -> str:
        return f"{name}-{size}x{size}.{extension}"

    outputs = [
        (generateOutputName(name, size), size)
        for name, sizes in fileroot
        for size in sizes
    ]
    outputs.append(("favicon.ico", 32))
    with multiprocessing.Pool() as pool:
        print(pool.map(export, outputs))


if __name__ == "__main__":
    main()