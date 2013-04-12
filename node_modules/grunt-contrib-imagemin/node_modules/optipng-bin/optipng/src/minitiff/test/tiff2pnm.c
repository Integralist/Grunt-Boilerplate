#include <stdio.h>
#include <stdlib.h>
#include "minitiff.h"


static void error(const char *msg)
{
    fprintf(stderr, "%s\n", msg);
    exit(EXIT_FAILURE);
}


int main(int argc, char *argv[])
{
    FILE *in_file, *out_file;
    struct minitiff_info tiff_info;
    unsigned int width, height, depth, y;
    unsigned char *row;

    if (argc <= 2)
        error("Usage: tiff2pnm input.tif output.pnm");

    in_file = fopen(argv[1], "rb");
    if (in_file == NULL)
        error("Can't open input (TIFF) file");
    minitiff_init_info(&tiff_info);
    minitiff_read_info(&tiff_info, in_file);
    width  = tiff_info.width;
    height = tiff_info.height;
    depth  = tiff_info.samples_per_pixel;
    if (width == 0 || height == 0)
        error("Invalid TIFF dimensions");
    if (depth != 1 && depth != 3)
        error("Invalid number of color planes");

    row = (unsigned char *)malloc(depth * width);
    if (row == NULL)
        error("Out of memory");

    out_file = fopen(argv[2], "wb");
    if (out_file == NULL)
        error("Can't open output (PNM) file");
    fprintf(out_file, "P%c\n%d %d\n255\n",
        ((depth == 1) ? '5' : '6'),
        width, height);

    for (y = 0; y < height; ++y)
    {
        minitiff_read_row(&tiff_info, row, y, in_file);
        if (fwrite(row, depth, width, out_file) != width)
            error("Can't write to output file");
    }

    minitiff_destroy_info(&tiff_info);
    fclose(in_file);
    fclose(out_file);
    return EXIT_SUCCESS;
}
