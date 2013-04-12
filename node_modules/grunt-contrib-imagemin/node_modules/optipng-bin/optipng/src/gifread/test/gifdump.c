/*
 * gifdump.c
 *
 * Copyright (C) 2003-2011 Cosmin Truta.
 * This software is distributed under the same licensing and warranty terms
 * as gifread.c.
 */

#include "gifread.h"
#include <stdio.h>


/*
 * Dumps the structure of a GIF image file.
 */
int GIFDump(const char *filename)
{
    int result;
    FILE *stream;
    struct GIFScreen screen;
    struct GIFImage image;
    struct GIFExtension ext;
    struct GIFGraphicCtlExt graphicExt;
    int loop;

    stream = fopen(filename, "rb");
    if (stream == NULL)
    {
        fprintf(stderr, "Error: Can't open %s\n", filename);
        return -1;
    }

    result = 0;
    printf("File: %s\n", filename);

    GIFReadScreen(&screen, stream);
    printf("Screen: %u x %u\n", screen.Width, screen.Height);
    if (screen.GlobalColorFlag)
        printf("  Global colors: %u\n", screen.GlobalNumColors);
    if (screen.PixelAspectRatio != 0)
        printf("  Pixel aspect ratio = %u\n", screen.PixelAspectRatio);

    GIFInitImage(&image, &screen, NULL);
    GIFInitExtension(&ext, &screen, 256);

    loop = 1;
    while (loop)
    {
        switch (GIFReadNextBlock(&image, &ext, stream))
        {
        case GIF_TERMINATOR:  /* ';' */
            loop = 0;
            break;
        case GIF_IMAGE:       /* ',' */
            ++result;
            printf("Image: %u x %u @ (%u, %u)\n",
                   image.Width, image.Height, image.LeftPos, image.TopPos);
            if (image.LocalColorFlag)
                printf("  Local colors: %u\n", image.LocalNumColors);
            printf("  Interlaced: %s\n", image.InterlaceFlag ? "YES" : "NO");
            break;
        case GIF_EXTENSION:   /* '!' */
            if (ext.Label == GIF_GRAPHICCTL)
            {
                GIFGetGraphicCtl(&graphicExt, &ext);
                printf("Graphic Control Extension: 0x%02X\n", ext.Label);
                printf("  Disposal method: %u\n", graphicExt.DisposalMethod);
                printf("  User input flag: %u\n", graphicExt.InputFlag);
                printf("  Delay time     : %u\n", graphicExt.DelayTime);
                if (graphicExt.TransparentFlag)
                    printf("  Transparent    : %u\n", graphicExt.Transparent);
            }
            else
                printf("Extension: 0x%02X\n", ext.Label);
            break;
        default:
            result = -1;
            fprintf(stderr, "Error: Unexpected data in %s\n", filename);
            loop = 0;
        }
    }

    fclose(stream);

    if (result == 0)
        fprintf(stderr, "Error: No image in %s\n", filename);
    return result;
}

/*
 * main
 */
int main(int argc, char *argv[])
{
    int result;
    int i;

    if (argc <= 1)
    {
        printf("Usage: gifdump <files.gif...>\n");
        return 0;
    }

    result = 0;
    for (i = 1; i < argc; ++i)
    {
        if (GIFDump(argv[i]) <= 0)
            result = 1;
    }

    return result;
}
