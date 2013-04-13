require 'base64'
require 'sass'
require 'image_optim' # https://github.com/toy/image_optim
         
module Sass::Script::Functions
    def url64(image)
        assert_type image, :String

        # compute file/path/extension
        
        base_path = '../../../' # from the current directory /app/styles/sass/helpers/

        root = File.expand_path(base_path, __FILE__)
        path = image.to_s[1, image.to_s.length-2]
        fullpath = File.expand_path(path, root)
        absname = File.expand_path(fullpath)
        ext = File.extname(path)

        # optimize image if it's a gif, jpg, png
        if ext.index(%r{\.(?:gif|jpg|png)}) != nil
            # homebrew link to pngcrush is outdated so need to avoid pngcrush for now
            # also homebrew doesn't support pngout so we ignore that too!
            # The following links show the compression settings...
            # https://github.com/toy/image_optim/blob/master/lib/image_optim/worker/advpng.rb
            # https://github.com/toy/image_optim/blob/master/lib/image_optim/worker/optipng.rb
            # https://github.com/toy/image_optim/blob/master/lib/image_optim/worker/jpegoptim.rb
            image_optim = ImageOptim.new(:pngcrush => false, :pngout => false, :advpng => {:level => 4}, :optipng => {:level => 7}, :jpegoptim => {:max_quality => 1}) 
            
            # we can lose the ! and the method will save the image to a temp directory, otherwise it'll overwrite the original image
            image_optim.optimize_image!(fullpath)
        end

        # base64 encode the file
        file = File.open(fullpath, 'rb') # read mode & binary mode
        filesize = File.size(file) / 1000 # seems to report the size as being 1kb smaller than it actually is (so if our limit is 32kb for IE8 then we need our limit to be 31kb)
        text = file.read
        file.close

        if filesize < 31 # we're avoiding IE8 32kb data uri size restriction
            text_b64 = Base64.encode64(text).gsub(/\r/,'').gsub(/\n/,'')
            contents = 'url(data:image/' + ext[1, ext.length-1] + ';base64,' + text_b64 + ')'
        else
            contents = 'url(' + image.to_s + ')' # if larger than 32kb then we'll just return the original image path url
        end

        Sass::Script::String.new(contents)
    end

    declare :url64, :args => [:string]
end